const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '.env') })

const ENV = process.env.NODE_ENV || 'development'
const USB_MOUNT_PATH = process.env.USB_MOUNT_PATH || '/mnt/sda1'
const CARDS_PATH = path.join(
  USB_MOUNT_PATH,
  process.env.CARDS_PATH || 'cards.json'
)

module.exports = {
  CARDS_PATH,
  CARD_UPDATE_INTERVAL: process.env.CARD_UPDATE_INTERVAL || 30 * 1000,

  // Cobot
  COBOT_CARDS_API:
    process.env.COBOT_CARDS_API ||
    'https://chimera.cobot.me/api/check_in_tokens',
  COBOT_CLIENT_ID:
    process.env.COBOT_CLIENT_ID || '7c3e837a765a28c1a47d24599695bd0a',
  COBOT_CLIENT_SECRET:
    process.env.COBOT_CLIENT_SECRET ||
    'e4da8ce36c6cb4f792390166a82841c209bc53339e796f59edd3739e6b069889',
  COBOT_SCOPE: process.env.COBOT_SCOPE || 'checkin_tokens',
  COBOT_USER_EMAIL: process.env.COBOT_USER_EMAIL || 'dana@chimeraarts.org',
  COBOT_USER_PASSWORD: process.env.COBOT_USER_PASSWORD || 'save me time',

  DOOR_OPEN_DELAY: ENV === 'test' ? 1 : 6000,
  ENV,

  // Nexudus
  NEXUDUS_APPLICATION_KEY: process.env.NEXUDUS_APPLICATION_KEY,
  NEXUDUS_SECRET_KEY: process.env.NEXUDUS_SECRET_KEY,

  RFID_READER_SERIAL_NUMBER: process.env.RFID_READER_SERIAL_NUMBER,

  USB_MOUNT_PATH,
}
