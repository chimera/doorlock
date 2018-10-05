const Nexudus = require('../models/nexudus')

module.exports = (req, res) => {
  Nexudus.getCards()
    .then( () => {
      res.redirect('/cards')
    })
    .catch(console.error)
}
