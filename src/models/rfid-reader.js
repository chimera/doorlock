const hid = require('node-hid')
const { RFID_PRODUCT_NAME } = require('../constants')

class RFIDReader {
  static devices() {
    return hid.devices() || []
  }

  static reader() {
    const device = this.devices().find(d => d.product === RFID_PRODUCT_NAME)

    if (!device) {
      throw new Error(
        `no RFID device found with the "RFID_PRODUCT_NAME" matching "${RFID_PRODUCT_NAME}"`
      )
    }

    return new hid.HID(device.path)
  }

  static read() {
    const device = this.reader()
    device.read((err, data) => console.log(err, data))
    return device
  }
}

module.exports = RFIDReader
