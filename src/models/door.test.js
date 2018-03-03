const Door = require('./door')
const tessel = require('tessel')

jest.mock('tessel')

describe('models/door', () => {
  describe('.open', () => {
    test('opens door', () => {
      jest.spyOn(Door, 'close')
      return Door.open().then(() => {
        expect(tessel.led[3].on).toBeCalled()
        expect(Door.close).toBeCalled()
      })
    })
  })

  describe('.close', () => {
    test('closes door', () => {
      Door.close()
      expect(tessel.led[3].off).toBeCalled()
    })
  })
})
