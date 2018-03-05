const axios = require('axios')
const { CARDS_PATH, COBOT_CARDS_API } = require('../constants')
const SDCard = require('./sd-card')

class Cards {
  static update() {
    return axios.get(COBOT_CARDS_API)
  }

  static read() {
    return SDCard.read(CARDS_PATH)
  }

  static write(cards) {
    return SDCard.write(CARDS_PATH, cards)
  }

  // static validate(number) {
  //   return this.read().then(cards => {
  //     return cards.find(c => c.number === number)
  //   })
  // }
}

module.exports = Cards
