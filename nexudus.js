const axios = require('axios')
const { NEXUDUS_APPLICATION_KEY, NEXUDUS_SECRET_KEY } = require('./constants')

class Nexudus {
  constructor() {
    if (!NEXUDUS_APPLICATION_KEY)
      throw new Error('missing "Nexudus_CLIENT_ID" env variable!')
    if (!NEXUDUS_SECRET_KEY)
      throw new Error('missing "Nexudus_CLIENT_SECRET" env variable!')
  }

  cards() {
    return axios
      .get(NEXUDUS_, {
        auth: {
          password: NEXUDUS_SECRET_KEY,
          username: NEXUDUS_APPLICATION_KEY,
        },
      })
      .then(
        resp => console.log('RESP:', resp)
        // resp.data.map(card => ({
        //   name: card.membership.name,
        //   number: card.token,
        // }))
      )
  }

  static authorize() {
    const qs = [
      `scope=${Nexudus_SCOPE}`,
      `grant_type=password`,
      `username=${NEXUDUS_USER_EMAIL}`,
      `password=${NEXUDUS_USER_PASSWORD}`,
      `client_id=${NEXUDUS_CLIENT_ID}`,
      `client_secret=${NEXUDUS_CLIENT_SECRET}`,
    ].join('&')
    return axios
      .post(`https://www.Nexudus.me/oauth/access_token?${qs}`)
      .then(resp => new Nexudus(resp.data.access_token))
  }
}

module.exports = Nexudus
