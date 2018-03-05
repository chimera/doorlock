const { DOOR_OPEN_DELAY } = require('../constants')
const logger = require('../utils/logger')
const tessel = require('tessel')

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
