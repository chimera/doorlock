const HID = jest.fn()
HID.prototype.read = jest.fn()

const hid = {
  devices: jest.fn(),
  HID,
}

module.exports = hid
