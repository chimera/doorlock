const fs = require('fs')
const SDCard = require('./sd-card')

jest.mock('fs')

describe('models/sd-card', () => {
  const filePath = '/path/to/cards.json'
  const expected = [{ name: 'John', number: '123' }]

  describe('.read', () => {
    test('should read and convert file data to JSON', () => {
      jest
        .spyOn(fs, 'readFile')
        .mockImplementationOnce((p, cb) => cb(null, JSON.stringify(expected)))
      return SDCard.read(filePath).then(actual => {
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('.write', () => {
    test('should write data to SD card', () => {
      jest.spyOn(fs, 'writeFile').mockImplementationOnce((path, text, cb) => {
        expect(path).toBe(filePath)
        expect(text).toBe(JSON.stringify(expected))
        cb()
      })
      return expect(SDCard.write(filePath, expected)).resolves.toBe()
    })
  })
})
