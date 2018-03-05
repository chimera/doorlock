const Cobot = require('./cobot')
const Cards = require('./cards')
const logger = require('../utils/logger')

class DoorLock {
  static initializeRFIDReader() {
    console.log('TODO: initialize RFID reader...')
    Cards.read().then(cards => logger.log('EXISTING:', cards.length, 'cards'))
  }

  static updateCards() {
    logger.log('UPDATING CARDS!')
    Cobot.authorize().then(cobot => {
      cobot.cards().then(cards => {
        logger.log('NEW:', cards.length, 'cards')
        Cards.write(cards)
      })
    })
  }

  static initialize() {
    logger.log('INITIALIZING DOORLOCK!')
    this.updateCards()
    this.initializeRFIDReader()
  }
}

module.exports = DoorLock
