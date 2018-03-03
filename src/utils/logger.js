const config = require('config')
const ENV = config.get('env')

class Logger {
  log() {
    ENV !== 'test' && console.log(...arguments)
  }
}

module.exports = new Logger()
