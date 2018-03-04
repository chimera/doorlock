const { ENV } = require('../constants')

class Logger {
  log() {
    ENV !== 'test' && console.log(...arguments)
  }
}

module.exports = new Logger()
