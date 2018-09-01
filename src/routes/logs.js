const logger = require('../models/logger')

module.exports = (req, res) => {

  logger.readLogs().then(logs => {
    logs = logs.reverse()
    res.render('logs', { logs })
  })
}
