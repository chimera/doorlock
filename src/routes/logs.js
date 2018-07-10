const Logs = require('../models/logs')

module.exports = (req, res) => {
  Logs.all().then(logs => {
    logs = logs.sort((a, b) => a.timestamp < b.timestamp)
    res.render('logs', { logs })
  })
}
