const Nexudus = require('../models/nexudus')

module.exports = (req, res) => {
  Nexudus.getCards()
    .then(cards => {
      console.log('GOT CARDS:', cards)
      res.redirect('/')
    })
    .catch(console.error)
}
