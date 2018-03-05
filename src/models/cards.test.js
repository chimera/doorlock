const Cards = require('./cards')

describe('models/cards', () => {
  describe('.update', () => {
    test.skip('should fetch list of RFID cards', () => {
      return Cards.update().then(cards => expect(cards).toEqual())
    })
  })

  describe('.validate', () => {
    test.skip('should check card against list', () => {})
  })
})
