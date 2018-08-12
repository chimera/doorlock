const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '.env') })

const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  CARD_UPDATE_INTERVAL: process.env.CARD_UPDATE_INTERVAL || 30 * 1000,

  // Cobot
  COBOT_CARDS_API:
    process.env.COBOT_CARDS_API ||
    'https://chimera.cobot.me/api/check_in_tokens',
  COBOT_CLIENT_ID: process.env.COBOT_CLIENT_ID,
  COBOT_CLIENT_SECRET: process.env.COBOT_CLIENT_SECRET,
  COBOT_SCOPE: 'checkin_tokens',
  COBOT_USER_EMAIL: process.env.COBOT_USER_EMAIL,
  COBOT_USER_PASSWORD: process.env.COBOT_USER_PASSWORD,

  DOOR_OPEN_DELAY: ENV === 'test' ? 1 : 6000,
  ENV,

  // Nexudus
  NEXUDUS_APPLICATION_KEY: process.env.NEXUDUS_APPLICATION_KEY,
  NEXUDUS_SECRET_KEY: process.env.NEXUDUS_SECRET_KEY,

  RFID_READER_SERIAL_NUMBER: process.env.RFID_READER_SERIAL_NUMBER,
}
