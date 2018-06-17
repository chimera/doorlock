const chalk = require('chalk')
const Cobot = require('./cobot')
const fs = require('fs')
const SerialPort = require('serialport')
const tessel = require('tessel')
const {
  CARD_UPDATE_INTERVAL,
  CARDS_PATH,
  DOOR_OPEN_DELAY,
  RFID_READER_SERIAL_NUMBER,
} = require('./constants')

const TEST = process.env.NODE_ENV === 'test'

class DoorLock {
  constructor() {
    this.log(chalk.gray('Initializing doorlock'))

    if (!RFID_READER_SERIAL_NUMBER) {
      throw new Error('No serial number set!')
    }

    this.cards = []
    // this.fetchCardListFromCobot()
    this.initializeRFIDReader()
  }

  initializeRFIDReader() {
    this.getListOfSerialDevices()
      .then(devices => {
        const device = this.findRFIDReaderDevice(devices)
        const reader = this.connectToRFIDReaderDevice(device.comName)
        reader.on('data', number => this.validateCard(number))
      })
      .catch(this.logErrorMessage)
  }

  getListOfSerialDevices() {
    return (SerialPort.list() || Promise.resolve([])).then(devices => {
      this.log(chalk.green('Available serial devices:'))
      this.log(chalk.gray(JSON.stringify(devices.map(d => d.comName), null, 2)))
      return devices
    })
  }

  findRFIDReaderDevice(devices) {
    const device = devices.find(
      d => d.serialNumber === RFID_READER_SERIAL_NUMBER
    )
    if (!device) {
      throw new Error(
        `No RFID card reader connected with the serial number "${RFID_READER_SERIAL_NUMBER}"!`
      )
    }
    return device
  }

  connectToRFIDReaderDevice(port) {
    this.log(chalk.green('Connected to device:'), chalk.gray(port))
    const device = new SerialPort(port, { baudRate: 9600 })
    const Readline = SerialPort.parsers.Readline
    const parser = new Readline()
    return device.pipe(parser)
  }

  validateCard(number) {
    console.log('raw:', JSON.stringify(number.toString().trim()))
    const scanned = parseInt(
      number
        .toString('hex')
        .trim() // Remove any whiespace or newlines
        .replace('\u0003', '') // Remove "end of text" character
        .replace('\u0002', '') // Remove "start of text" character
        .substring(3) // Strip off con
        .slice(0, -2), // Strip off checksum
      16
    )

    this.log(chalk.green('Scanned card:'), chalk.gray(scanned))

    return this.readCardsFromSDCard().then(cards => {
      const card = cards.find(c => parseInt(c.number) === scanned)

      if (card) {
        const name = card.name.split(' ')[0]
        this.log(chalk.green(`Welcome in ${name}!`), chalk.gray(scanned))
        this.openDoor()
      } else {
        this.log(chalk.red('Card is invalid:'), chalk.gray(scanned))
      }
    })
  }

  openDoor() {
    return new Promise(resolve => {
      this.log(chalk.green('Opening door!'))

      // TODO: trigger door opening...
      if (tessel.led) tessel.led[3].on()

      setTimeout(() => {
        // TODO: trigger door closing
        this.closeDoor()
        resolve()
      }, DOOR_OPEN_DELAY)
    })
  }

  closeDoor() {
    this.log(chalk.green('Closing door!'))
    if (tessel.led) tessel.led[3].off()
  }

  fetchCardListFromCobot() {
    this.log(chalk.gray('Updating cards...'))
    Cobot.authorize()
      .then(cobot => cobot.cards())
      .then(cards => {
        this.log(chalk.green('UPDATED CARDS:', cards.length, 'cards'))
        this.writeCardsToSDCard(cards)
        this.cards = cards
      })
      .then(() => {
        this.log(
          chalk.gray(
            'Updating card list in',
            CARD_UPDATE_INTERVAL / 1000,
            'seconds...'
          )
        )
        setTimeout(this.fetchCardListFromCobot.bind(this), CARD_UPDATE_INTERVAL)
      })
      .catch(this.logErrorMessage)
  }

  sortCardsByName(cards) {
    const sorted = cards.sort(
      (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
    )
    this.log(chalk.green('CARDS:'), sorted)
    return sorted
  }

  writeCardsToSDCard(cards) {
    const json = JSON.stringify(this.sortCardsByName(cards))
    return new Promise((resolve, reject) => {
      fs.writeFile(CARDS_PATH, json, err => {
        console.log(json)
        console.log('JSON', json)
        if (err) return reject(err)
        resolve()
      })
    })
  }

  readCardsFromSDCard() {
    return new Promise((resolve, reject) => {
      fs.readFile(CARDS_PATH, (err, data) => {
        if (err) return reject(err)
        resolve(JSON.parse(data))
      })
    })
  }

  logErrorMessage(error) {
    if (TEST) return
    console.error(chalk.red(error.message))
    console.error(chalk.gray(error.stack))
    process.exit
  }

  log() {
    if (TEST) return
    console.log(...arguments)
  }
}

// Start up the doorlock
new DoorLock()
