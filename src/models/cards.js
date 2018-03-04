const axios = require('axios')
const { COBOT_CARDS_API } = require('../constants')

class Cards {
  static update() {
    return axios.get(COBOT_CARDS_API)
  }
}

module.exports = Cards
