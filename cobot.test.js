const axios = require('axios')
const Cobot = require('./cobot')

jest.mock('axios')

describe('models/cobot', () => {
  describe('.authorize', () => {
    test('should fetch a new token', () => {
      const resp = { data: { access_token: 'meow' } }
      jest.spyOn(axios, 'post').mockResolvedValue(resp)
      return Cobot.authorize().then(cobot => {
        expect(axios.post).toBeCalled()
        expect(cobot).toBeInstanceOf(Cobot)
        expect(cobot.token).toBe('meow')
      })
    })
  })

  describe('.cards', () => {
    test('returns a structured list of cards', () => {
      const resp = {
        data: [
          { membership: { id: 'foo', name: 'John' }, token: '001' },
          { membership: { id: 'bar', name: 'Jane' }, token: '002' },
        ],
      }
      const expected = [
        { name: 'John', number: '001' },
        { name: 'Jane', number: '002' },
      ]
      jest.spyOn(axios, 'get').mockResolvedValue(resp)

      // TODO: why doesnt this work? It should...
      // axios.get.mockResolvedValue(resp)

      return new Cobot('fake-value')
        .cards()
        .then(actual => expect(actual).toEqual(expected))
    })
  })
})
