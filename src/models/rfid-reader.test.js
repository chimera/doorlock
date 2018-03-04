const hid = require('node-hid')
const RFIDReader = require('./rfid-reader')

jest.mock('node-hid')

const rfidDevice = {
  interface: -1,
  manufacturer: 'Apple',
  path:
    'IOService:/IOResources/IOBluetoothHCIController/AppleBroadcomBluetoothHostController/IOBluetoothDevice/IOBluetoothL2CAPChannel/AppleHSBluetoothDevice/Keyboard / Boot@1/AppleHSBluetoothHIDDriver',
  product: 'KB800HM Kinesis Freestyle2 for Mac',
  productId: 615,
  release: 0,
  serialNumber: '04-69-f8-c6-d2-c2',
  usage: 6,
  usagePage: 1,
  vendorId: 76,
}

describe('models/rfid-reader', () => {
  const devices = [rfidDevice]

  beforeAll(() => {
    hid.devices.mockReturnValue(devices)
  })

  describe('.devices', () => {
    test('lists devices', () => {
      const actual = RFIDReader.devices()
      expect(actual).toEqual(devices)
    })
  })

  describe('.reader', () => {
    test('should connect to the RFID reader and return it', () => {
      const actual = RFIDReader.reader()
      expect(actual).toBeInstanceOf(hid.HID)
    })
  })

  describe('.read', () => {
    test('it should listen for keyboard input', () => {
      const device = RFIDReader.read()
      console.log(device)
      expect(device.read).toBeCalled()
    })
  })
})
