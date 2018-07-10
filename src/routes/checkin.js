const Cards = require('../models/cards')
const Logs = require('../models/logs')

module.exports = (req, res) => {
  const rfid = req.body.rfid.trim().toLowerCase()
  console.log('SCANNED CARD:', rfid)

  Cards.validate(rfid).then(card => {
    console.log('CARD:', card)
    // TODO: add to log if success
    if (card) {
      res.redirect('/success?name=' + card.name)
      Logs.log({ timestamp: new Date().getTime(), card }).then(() =>
        console.log('Logged!')
      )
    } else {
      res.redirect('/failure')
    }
  })
}
