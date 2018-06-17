const axios = require('axios')
const {
  COBOT_CARDS_API,
  COBOT_CLIENT_ID,
  COBOT_CLIENT_SECRET,
  COBOT_SCOPE,
  COBOT_USER_EMAIL,
  COBOT_USER_PASSWORD,
} = require('./constants')

class Cobot {
  constructor(token) {
    this.token = token
  }

  cards() {
    if (!COBOT_CARDS_API)
      throw new Error('missing "COBOT_CARDS_API" env variable!')
    return axios
      .get(COBOT_CARDS_API, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then(resp =>
        resp.data.map(card => ({
          name: card.membership.name,
          number: card.token,
        }))
      )
  }

  static authorize() {
    if (!COBOT_SCOPE) throw new Error('missing "COBOT_SCOPE" env variable!')
    if (!COBOT_USER_EMAIL)
      throw new Error('missing "COBOT_USER_EMAIL" env variable!')
    if (!COBOT_USER_PASSWORD)
      throw new Error('missing "COBOT_USER_PASSWORD" env variable!')
    if (!COBOT_CLIENT_ID)
      throw new Error('missing "COBOT_CLIENT_ID" env variable!')
    if (!COBOT_CLIENT_SECRET)
      throw new Error('missing "COBOT_CLIENT_SECRET" env variable!')
    const qs = [
      `scope=${COBOT_SCOPE}`,
      `grant_type=password`,
      `username=${COBOT_USER_EMAIL}`,
      `password=${COBOT_USER_PASSWORD}`,
      `client_id=${COBOT_CLIENT_ID}`,
      `client_secret=${COBOT_CLIENT_SECRET}`,
    ].join('&')
    return axios
      .post(`https://www.cobot.me/oauth/access_token?${qs}`)
      .then(resp => new Cobot(resp.data.access_token))
  }
}

module.exports = Cobot
