require('dotenv').config()

const path = require('path')

const ENV = process.env.NODE_ENV || 'development'
const USB_MOUNT_PATH = process.env.USB_MOUNT_PATH || '/mnt/sda1'
const CARDS_PATH = path.join(
  USB_MOUNT_PATH,
  process.env.CARDS_PATH || 'cards.json'
)

module.exports = {
  CARDS_PATH,
  COBOT_CARDS_API:
    process.env.COBOT_CARDS_API ||
    'https://chimera.cobot.me/api/check_in_tokens',
  COBOT_CLIENT_ID: process.env.COBOT_CLIENT_ID,
  COBOT_CLIENT_SECRET: process.env.COBOT_CLIENT_SECRET,
  COBOT_SCOPE: process.env.COBOT_SCOPE || 'checkin_tokens',
  COBOT_USER_EMAIL: process.env.COBOT_USER_EMAIL,
  COBOT_USER_PASSWORD: process.env.COBOT_USER_PASSWORD,
  DOOR_OPEN_DELAY: ENV === 'test' ? 1 : 6000,
  ENV,
  RFID_PRODUCT_NAME: process.env.RFID_PRODUCT_NAME,
  USB_MOUNT_PATH,
}
