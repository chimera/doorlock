const Cards = require('./cards')

describe('models/cards', () => {
  describe('.update', () => {
    test('should fetch list of RFID cards', () => {
      return Cards.update().then(cards => expect(cards).toEqual())
    })
  })
})
