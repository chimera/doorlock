const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '.env') })

const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  CARD_UPDATE_INTERVAL: process.env.CARD_UPDATE_INTERVAL || 30 * 1000,

  // Cobot
  COBOT_CARDS_API:
    process.env.COBOT_CARDS_API ||
    'https://chimera.cobot.me/api/check_in_tokens',
  COBOT_SCOPE: 'checkin_tokens',
  COBOT_ACCESS_TOKEN: process.env.COBOT_ACCESS_TOKEN,

  DOOR_OPEN_DELAY: ENV === 'test' ? 1 : 6000,
  ENV,

  // Nexudus
  NEXUDUS_APPLICATION_KEY: process.env.NEXUDUS_APPLICATION_KEY,
  NEXUDUS_SECRET_KEY: process.env.NEXUDUS_SECRET_KEY,
  NEXUDUS_APP_KEY: process.env.NEXUDUS_APP_KEY,
  NEXUDUS_USER_TOKEN: process.env.NEXUDUS_USER_TOKEN,
  NEXUDUS_USER_TOKEN_DATE: process.env.NEXUDUS_USER_TOKEN_DATE,
  NEXUDUS_USER_TOKEN_HASH: process.env.NEXUDUS_USER_TOKEN_HASH,
  NEXUDUS_USER_DOMAIN: process.env.NEXUDUS_USER_DOMAIN,
  NEXUDUS_USER_EMAIL: process.env.NEXUDUS_USER_EMAIL,
  NEXUDUS_APP_SECRET: process.env.NEXUDUS_APP_SECRET,

  RFID_READER_SERIAL_NUMBER: process.env.RFID_READER_SERIAL_NUMBER,
}
