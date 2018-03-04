require('dotenv').config()

const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  COBOT_CARDS_API: process.env.COBOT_CARDS_API,
  COBOT_CLIENT_ID: process.env.COBOT_CLIENT_ID,
  COBOT_CLIENT_SECRET: process.env.COBOT_CLIENT_SECRET,
  COBOT_SCOPE: process.env.COBOT_SCOPE,
  COBOT_USER_EMAIL: process.env.COBOT_USER_EMAIL,
  COBOT_USER_PASSWORD: process.env.COBOT_USER_PASSWORD,
  DOOR_OPEN_DELAY: ENV === 'test' ? 1 : 6000,
  ENV,
  RFID_PRODUCT_NAME: process.env.RFID_PRODUCT_NAME,
}
