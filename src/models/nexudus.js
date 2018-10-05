const Cards = require('./cards')
const https = require('https')
const axios = require('axios')
const crypto = require('crypto');

const {
  CARD_UPDATE_INTERVAL,
  NEXUDUS_APP_KEY,
  NEXUDUS_USER_TOKEN,
  NEXUDUS_USER_TOKEN_DATE,
  NEXUDUS_USER_TOKEN_HASH,
  NEXUDUS_APP_SECRET
} = require('../../constants')

module.exports = class Nexudus {
  constructor() {
  }

  static validateHash() {
    if (!NEXUDUS_APP_KEY)
      throw new Error('missing "NEXUDUS_APP_KEY" env variable!')
    if (!NEXUDUS_USER_TOKEN)
      throw new Error('missing "NEXUDUS_USER_TOKEN" env variable!')
    if (!NEXUDUS_USER_TOKEN_DATE)
      throw new Error('missing "NEXUDUS_USER_TOKEN_DATE" env variable!')
    if (!NEXUDUS_USER_TOKEN_HASH)
      throw new Error('missing "NEXUDUS_USER_TOKEN_HASH" env variable!')
    if (!NEXUDUS_APP_SECRET)
      throw new Error('missing "NEXUDUS_APP_SECRET" env variable!')

    //Calculate hash
    var param = [NEXUDUS_USER_TOKEN, NEXUDUS_APP_KEY, NEXUDUS_USER_TOKEN_DATE]
    param.sort(); // sort alphabetically
    var calc = (param.join("|") + NEXUDUS_APP_SECRET)
    var calculatedHash = crypto.createHash('md5').update(calc).digest('hex')

    //Check if the request is valid
    var valid = (calculatedHash == NEXUDUS_USER_TOKEN_HASH);
    if (!valid) {
      throw new Error('the NEXUDUS_USER_TOKEN, NEXUDUS_APP_KEY, or NEXUDUS_USER_TOKEN_DATE env variables failed validation. Ensure that you are getting these values from the Nexudus app installation process and copy-pasting them properly. Hash: '+calculatedHash+' Should be: '+NEXUDUS_USER_TOKEN_HASH)
    }
  }

  static doCheckin(membership_id) {
    this.validateHash() 

    this.username = NEXUDUS_APP_KEY;
    this.password = crypto.createHash('md5').update(NEXUDUS_USER_TOKEN+NEXUDUS_APP_SECRET).digest('hex');
    this.token = Buffer.from(this.username+":"+this.password).toString('base64');

    return new Promise((resolve, reject) => {
      // TODO move to axios
      const req = https.request(
        {
          headers: {
            Authorization: `Basic ${this.token}`,
          },
          hostname: 'spaces.nexudus.com',
          method: 'GET',
          path: '/api/FIXME',
        },
        res => {
          const { statusCode, headers } = res
          res.setEncoding('utf8')

          let coworkers = ''
          res.on('data', chunk => {
            coworkers += chunk
          })

          res.on('end', () => {
            console.log('\n----------------------------------------------------')
            console.log('NEXUDUS CARDS RESPONSE: '+coworkers)
            console.log(JSON.stringify({ statusCode, headers }, null, 2))
            coworkers = JSON.parse(coworkers)
            console.log(JSON.stringify(coworkers.Records, null, 2))
            if (!coworkers || !coworkers.Records || !coworkers.Records.length) {
              throw new Error('No coworkers received from API!')
            }
            resolve(
              coworkers.Records.map(coworker => ({
                name: coworker.FullName,
                number: coworker.AccessCardId,
              }))
            )
            console.log(
              '----------------------------------------------------\n'
            )
          })
        }
      )

      req.on('socket', function (socket) {
          socket.setTimeout(9000);
          socket.on('timeout', function() {
              req.abort();
          });
      });

      req.on('data', console.log)
      req.on('error', e => {
        console.error(e)
        reject(e)
      })
      req.end()
      console.log(req)
    })
  }

  static cards() {
    this.validateHash()

    this.username = NEXUDUS_APP_KEY;
    this.password = crypto.createHash('md5').update(NEXUDUS_USER_TOKEN+NEXUDUS_APP_SECRET).digest('hex');
    this.token = Buffer.from(this.username+":"+this.password).toString('base64');

    return new Promise((resolve, reject) => {
      // TODO move to axios
      const req = https.request(
        {
          headers: {
            Authorization: `Basic ${this.token}`,
          },
          hostname: 'spaces.nexudus.com',
          method: 'GET',
          path: '/api/spaces/coworkers',
        },
        res => {
          const { statusCode, headers } = res
          res.setEncoding('utf8')

          let coworkers = ''
          res.on('data', chunk => {
            coworkers += chunk
          })

          res.on('end', () => {
            console.log('\n----------------------------------------------------')
            console.log('NEXUDUS CARDS RESPONSE: '+coworkers)
            console.log(JSON.stringify({ statusCode, headers }, null, 2))
            coworkers = JSON.parse(coworkers)
            console.log(JSON.stringify(coworkers.Records, null, 2))
            if (!coworkers || !coworkers.Records || !coworkers.Records.length) {
              throw new Error('No coworkers received from API!')
            }
            resolve(
              coworkers.Records.map(coworker => ({
                name: coworker.FullName,
                number: coworker.AccessCardId,
              }))
            )
            console.log(
              '----------------------------------------------------\n'
            )
          })
        }
      )
      req.on('data', console.log)
      req.on('error', e => {
        console.error(e)
        reject(e)
      })
      req.end()
      console.log(req)
    })
  }

  static getCards() {
    console.log('Updating cards...')
    return this.cards()
      .then(cards => Cards.write(cards))
    // .then(() => {
    //   console.log(
    //     'Updating card list in',
    //     CARD_UPDATE_INTERVAL / 1000,
    //     'seconds...'
    //   )
    //   setTimeout(this.getCards.bind(this), CARD_UPDATE_INTERVAL)
    // })
  }
}
