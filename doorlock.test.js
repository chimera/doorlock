const DoorLock = require('./doorlock')
const tessel = require('tessel')
const fs = require('fs')
const { CARDS_PATH, RFID_READER_SERIAL_NUMBER } = require('./constants')

jest.mock('tessel')
jest.mock('fs')

describe('models/doorlock', () => {
  const filePath = '/path/to/cards.json'
  let doorLock

  beforeEach(() => {
    doorLock = new DoorLock()
  })

  describe('.findRFIDReaderDevice', () => {
    test('should find a device by its serial number', () => {
      const device = { serialNumber: RFID_READER_SERIAL_NUMBER }
      const devices = [device, { serialNumber: 'foo' }]
      const found = doorLock.findRFIDReaderDevice(devices)
      expect(device).toBe(found)
    })
  })

  describe('.validateCard', () => {
    test('should match existing card', () => {
      const expected = 5109933
      const scanned = '3F004DF8AD27'
      const cards = [{ name: 'John', number: `0000${expected}}` }]
      jest
        .spyOn(doorLock, 'readCardsFromSDCard')
        .mockImplementationOnce(() => Promise.resolve(cards))
      jest
        .spyOn(doorLock, 'openDoor')
        .mockImplementationOnce(() => Promise.resolve())
      return doorLock
        .validateCard(scanned)
        .then(() => expect(doorLock.openDoor).toBeCalled())
    })
  })

  describe('.openDoor', () => {
    test('Should turn on success LED', () => {
      jest.spyOn(doorLock, 'closeDoor')
      return doorLock.openDoor().then(() => {
        expect(tessel.led[3].on).toBeCalled()
        expect(doorLock.closeDoor).toBeCalled()
      })
    })
  })

  describe('.closeDoor', () => {
    test('should turn off success LED', () => {
      doorLock.closeDoor()
      expect(tessel.led[3].off).toBeCalled()
    })
  })

  describe('.readCardsFromSDCard', () => {
    test('should read and convert file data to JSON', () => {
      const cards = [{ name: 'John', number: '123' }]
      jest
        .spyOn(fs, 'readFile')
        .mockImplementationOnce((p, cb) => cb(null, JSON.stringify(cards)))
      return doorLock.readCardsFromSDCard(filePath).then(actual => {
        expect(actual).toEqual(cards)
      })
    })
  })

  describe('.writeCardsToSDCard', () => {
    xtest('should write data to SD card', () => {
      const cards = [{ name: 'John', number: '123' }]
      jest.spyOn(fs, 'writeFile').mockImplementationOnce((path, text, cb) => {
        console.log('TEXT', text)
        console.log('PATH', path)
        expect(path).toBe(CARDS_PATH)
        expect(text).toBe(JSON.stringify(cards))
        cb()
      })
      return expect(doorLock.writeCardsToSDCard(cards)).resolves.toBe()
    })
  })
})
