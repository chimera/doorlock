const Cobot = require('../models/cobot')

module.exports = (req, res) => {
  Cobot.getCards()
    .then(cards => {
      console.log('GOT CARDS:', cards)
      res.redirect('/')
    })
    .catch(console.error)
}
