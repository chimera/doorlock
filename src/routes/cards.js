const Cards = require('../models/cards')

module.exports = (req, res) => {
  Cards.all().then(cards => res.render('cards', { cards }))
}
