const axios = require('axios')
const Cards = require('./cards')
const CachedTimePasses = require('./cached_time_passes')
const https = require('https')
const {
  CARD_UPDATE_INTERVAL,
  COBOT_CARDS_API,
  COBOT_ACCESS_TOKEN,
  COBOT_SCOPE,
} = require('../../constants')

module.exports = class Cobot {
  constructor(token) {
    this.token = token
  }

  checkin(membership_id) {
    if (!COBOT_CARDS_API) throw new Error('missing "COBOT_CARDS_API" env variable!')

    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      secureOptions: require('constants').SSL_OP_NO_TLSv1_2,
      ciphers: 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
      honorCipherOrder: true
    }

    return axios
      .post(`https://chimera.cobot.me/api/memberships/${membership_id}/work_sessions`, null, config)
      .then(resp => {
        console.log('RESPONSE:', resp.data)
        const { membership } = resp.data
        if (!membership) throw new Error('No membership received')
        return {
          membership_id: membership.id,
          name: membership.name,
          valid_until: resp.data.valid_until,
        }
      })
      .catch(err => {
        console.error(err.response.data)
        throw new Error(err.response.data.base)
      })
  }

  gettimepasses() {
    if (!COBOT_CARDS_API) throw new Error('missing "COBOT_CARDS_API" env variable!')

    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      secureOptions: require('constants').SSL_OP_NO_TLSv1_2,
      ciphers: 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
      honorCipherOrder: true
    }

    return axios
      .get(`https://chimera.cobot.me/api/time_passes/unused`, config)
      .then(resp => {
        console.log('RESPONSE:', resp.data)
        return resp.data
      })
      .catch(err => {
        console.error(err.response.data)
        throw new Error(err.response.data.base)
      })
  }

  cards() {
    if (!COBOT_CARDS_API)
      throw new Error('missing "COBOT_CARDS_API" env variable!')
    return new Promise((resolve, reject) => {
      // TODO move to axios
      const req = https.request(
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          hostname: 'chimera.cobot.me',
          method: 'GET',
          path: '/api/check_in_tokens',
          secureOptions: require('constants').SSL_OP_NO_TLSv1_2,
          ciphers: 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
          honorCipherOrder: true
        },
        res => {
          const { statusCode, headers } = res
          console.log('\n----------------------------------------------------')
          console.log('COBOT CARDS RESPONSE:')
          console.log(JSON.stringify({ statusCode, headers }, null, 2))
          res.setEncoding('utf8')

          let cards = ''
          res.on('data', chunk => {
            cards += chunk
          })

          res.on('end', () => {
            cards = JSON.parse(cards)
            console.log(JSON.stringify(cards, null, 2))
            if (!cards || !cards.length) {
              throw new Error('No cards received from API!')
            }
            resolve(
              cards.map(card => ({
                membership_id: card.membership.id,
                name: card.membership.name,
                number: card.token,
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
    })
  }


  static doCheckin(card) {
    console.log('Checking in ', card)
    return (new Cobot(COBOT_ACCESS_TOKEN)).checkin(card.membership_id)
  }

  static doCheckTimepasses(card) {
    console.log('Checking time passes for ', card)
    if (CachedTimePasses.isCacheValid()) {
      console.log('Using cached time passes')
      return {
        unused_count: CachedTimePasses.get(card.membership_id).length
      }
    } else {
      console.log('Cache expired, getting new time passes')
      passes = (new Cobot(COBOT_ACCESS_TOKEN)).gettimepasses()
      CachedTimePasses.write(passes) // cache locally
    }
    // no matter what we use the same logic to check timepass validity
    // TODO: check date/time of timepass validity as well
    return {
      unused_count: CachedTimePasses.get(card.membership_id).length
    }
  }

  static getCards() {
    console.log('Updating cards...')
    return (new Cobot(COBOT_ACCESS_TOKEN)).cards()
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
