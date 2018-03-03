const config = require('config')
const logger = require('../utils/logger')
const tessel = require('tessel')

const DOOR_OPEN_DELAY = config.get('openDelay')

// const fs = require('fs')
// const path = require('path')

// const USB_MOUNT_PATH = '/mnt/sda1'
// const CARDS_PATH = path.join(USB_MOUNT_PATH, 'cards.json')

class Door {
  static open() {
    logger.log('OPEN DOOR')

    // TODO: trigger door opening...
    tessel.led[3].on()

    return new Promise(resolve => {
      setTimeout(() => {
        // TODO: trigger door closing
        Door.close()
        resolve()
      }, DOOR_OPEN_DELAY)
    })
  }

  static close() {
    logger.log('CLOSE DOOR')
    tessel.led[3].off()
  }
}

module.exports = Door

// const doorlock = {}

// doorlock.updateCards = () => {
//   console.log('fetch cards from API and update file')
//   const cards = [{ card: '1234', name: 'John' }, { card: '5566', name: 'Jane' }]
//   doorlock.writeCards(cards)
// }

// doorlock.readCards = cb => {
//   fs.readFile(CARDS_PATH, function(err, data) {
//     if (err) throw err
//     console.log('data:', data.toString())
//     cb(JSON.parse(data))
//   })
// }

// doorlock.writeCards = cards => {
//   const text = JSON.stringify(cards)
//   fs.writeFile(CARDS_PATH, text, err => {
//     if (err) throw err
//     console.log('wrote:', cards)
//   })
// }

// doorlock.open = () => {
//   console.log('open!')
//   tessel.led[2].on()
//   setTimeout(() => tessel.led[2].off(), 3000)
// }

// doorlock.close = () => {
//   console.log('close!')
//   tessel.led[3].on()
//   setTimeout(() => tessel.led[3].off(), 3000)
// }

// module.exports = doorlock
