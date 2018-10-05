const Cobot = require('../models/cobot')

module.exports = (req, res) => {
  Cobot.getCards()
    .then( () => {
      res.redirect('/cards')
    })
    .catch(console.error)
}
