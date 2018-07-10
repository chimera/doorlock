const Cards = require('../models/cards')

module.exports = (req, res) => {
  const rfid = req.body.rfid.trim().toLowerCase()
  console.log('SCANNED CARD:', rfid)

  Cards.validate(rfid).then(card => {
    console.log('CARD:', card)
    // TODO: add to log if success
    if (card) {
      res.redirect('/success?name=' + card.name)
    } else {
      res.redirect('/failure')
    }
  })
}
