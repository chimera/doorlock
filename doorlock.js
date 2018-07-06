'use strict'

// const axios = require('axios')
const https = require('https')
const fs = require('fs')
const SerialPort = require('serialport')
const tessel = require('tessel')
const {
  CARD_UPDATE_INTERVAL,
  CARDS_PATH,
  COBOT_CARDS_API,
  COBOT_CLIENT_ID,
  COBOT_CLIENT_SECRET,
  COBOT_SCOPE,
  COBOT_USER_EMAIL,
  COBOT_USER_PASSWORD,
  DOOR_OPEN_DELAY,
  ENV,
  RFID_READER_SERIAL_NUMBER,
} = require('./constants')

const TEST = ENV === 'test'

class Cobot {
  constructor(token) {
    this.token = token
  }

  cards() {
    if (!COBOT_CARDS_API)
      throw new Error('missing "COBOT_CARDS_API" env variable!')
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          hostname: 'chimera.cobot.me',
          method: 'GET',
          path: '/api/check_in_tokens',
        },
        res => {
          const { statusCode, headers } = res
          console.log('\n----------------------------------------------------')
          console.log('COBOT CARDS RESPONSE:')
          console.log(JSON.stringify({ statusCode, headers }, null, 2))
          res.setEncoding('utf8')

          let cards = ''
          res.on('data', chunk => {
            cards += chunk
          })

          res.on('end', () => {
            cards = JSON.parse(cards)
            console.log(JSON.stringify(cards, null, 2))
            if (!cards || !cards.length) {
              throw new Error('No cards received from API!')
            }
            resolve(
              cards.map(card => ({
                name: card.membership.name,
                number: card.token,
              }))
            )
            console.log(
              '----------------------------------------------------\n'
            )
          })
        }
      )
      req.on('data', console.log)
      req.on('error', e => {
        console.error(e)
        reject(e)
      })
      req.end()
    })
    // return axios
    //   .get(COBOT_CARDS_API, {
    //     headers: {
    //       Authorization: `Bearer ${this.token}`,
    //     },
    //   })
    //   .then(resp =>
    //     resp.data.map(card => ({
    //       name: card.membership.name,
    //       number: card.token,
    //     }))
    //   )
  }

  static authorize() {
    console.log('Authorizing Cobot application...')
    if (!COBOT_SCOPE) throw new Error('missing "COBOT_SCOPE" env variable!')
    if (!COBOT_USER_EMAIL)
      throw new Error('missing "COBOT_USER_EMAIL" env variable!')
    if (!COBOT_USER_PASSWORD)
      throw new Error('missing "COBOT_USER_PASSWORD" env variable!')
    if (!COBOT_CLIENT_ID)
      throw new Error('missing "COBOT_CLIENT_ID" env variable!')
    if (!COBOT_CLIENT_SECRET)
      throw new Error('missing "COBOT_CLIENT_SECRET" env variable!')

    const qs = [
      `scope=${COBOT_SCOPE}`,
      `grant_type=password`,
      `username=${COBOT_USER_EMAIL}`,
      `password=${encodeURI(COBOT_USER_PASSWORD)}`,
      `client_id=${COBOT_CLIENT_ID}`,
      `client_secret=${COBOT_CLIENT_SECRET}`,
    ].join('&')

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'www.cobot.me',
          method: 'POST',
          path: `/oauth/access_token?${qs}`,
        },
        res => {
          const { statusCode, headers } = res
          console.log('\n----------------------------------------------------')
          console.log('COBOT AUTHORIZATION RESPONSE:')
          console.log(JSON.stringify({ statusCode, headers }, null, 2))

          res.setEncoding('utf8')

          let cobot
          res.on('data', chunk => {
            const body = JSON.parse(chunk)
            console.log(JSON.stringify({ body }, null, 2))
            const token = body.access_token
            if (!token) {
              console.error(`Expected access token, got: ${body}`)
              throw new Error('Error getting access token')
            }
            cobot = new Cobot(token)
          })

          res.on('end', () => {
            resolve(cobot)
            console.log(
              '----------------------------------------------------\n'
            )
          })
        }
      )
      req.on('error', e => reject(e))
      req.end()
    })
    // return axios
    //   .post(`https://www.cobot.me/oauth/access_token?${qs}`)
    //   .then(resp => new Cobot(resp.data.access_token))
  }
}

class DoorLock {
  constructor() {
    this.log('Initializing doorlock')

    if (!RFID_READER_SERIAL_NUMBER) {
      throw new Error('No serial number set!')
    }

    this.cards = []
    this.fetchCardListFromCobot()
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
      this.log('Available serial devices:')
      this.log(JSON.stringify(devices.map(d => d.comName), null, 2))
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
    this.log('Connected to device:', port)
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

    this.log('Scanned card:', scanned)

    return this.readCardsFromSDCard().then(cards => {
      const card = cards.find(c => parseInt(c.number) === scanned)

      if (card) {
        const name = card.name.split(' ')[0]
        this.log(`Welcome in ${name}!`, scanned)
        this.openDoor()
      } else {
        this.log('Card is invalid:', scanned)
      }
    })
  }

  openDoor() {
    return new Promise(resolve => {
      this.log('Opening door!')

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
    this.log('Closing door!')
    if (tessel.led) tessel.led[3].off()
  }

  fetchCardListFromCobot() {
    this.log('Updating cards...')
    Cobot.authorize()
      .then(cobot => cobot.cards())
      .then(cards => {
        this.log('UPDATED CARDS:', cards.length, 'cards')
        this.writeCardsToSDCard(cards)
        this.cards = cards
      })
      .then(() => {
        this.log(
          'Updating card list in',
          CARD_UPDATE_INTERVAL / 1000,
          'seconds...'
        )
        setTimeout(this.fetchCardListFromCobot.bind(this), CARD_UPDATE_INTERVAL)
      })
      .catch(this.logErrorMessage)
  }

  sortCardsByName(cards) {
    const sorted = cards.sort(
      (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
    )
    return sorted
  }

  writeCardsToSDCard(cards) {
    const json = JSON.stringify(this.sortCardsByName(cards))
    return new Promise((resolve, reject) => {
      fs.writeFile(CARDS_PATH, json, err => {
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
    console.error(error.message)
    console.error(error.stack)
    process.exit
  }

  log() {
    if (TEST) return
    console.log(...arguments)
  }
}

// Start up the doorlock
new DoorLock()
