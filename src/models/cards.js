const axios = require('axios')
const config = require('config')

class Cards {
  static update() {
    return axios.get(config.get('cardApi'))
  }
}

module.exports = Cards
