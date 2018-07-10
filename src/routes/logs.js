const Logs = require('../models/logs')

module.exports = (req, res) => {
  Logs.all().then(logs => res.render('logs', { logs }))
}
