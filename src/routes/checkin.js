const Cards = require('../models/cards')
const Door = require('../models/door')
const logger = require('../models/logger')
const Cobot = require('../models/cobot')

module.exports = (req, res) => {
  const rfid = req.body.rfid.trim().toLowerCase()
  console.log('SCANNED CARD:', rfid)

  Cards.validate(rfid).then(card => {
    console.log('CARD:', card)
    if (!card) {
      logger.logRejectedCard({number: rfid})
      return reponse(req,res,'/failure',false)
    }

    logger.logGrantedCard(card)

    Cobot.doCheckin(card)
      .then(checkin => {
        Cobot.doCheckTimepasses(card)
          .then(time_passes => {
            // if we got here, 0 time passes is not a problem
            // because of an unlimited plan. therefore, output
            // nothing for the count. ("you have passes remaining")
            if (time_passes.unused_count === 0) {
              remaining = undefined;
            } else {
              remaining = time_passes.unused_count;
            }
            data = {"name": checkin.name, "remaining": remaining}
            console.log(data)
            reponse(req,res,`/success?name=${checkin.name}`,true,data)
          })
          .catch(err => {
            logger.logError({number: rfid}, err)
            res.status(500).send(""+err).end()
          })
      })
      .catch(err => {
        logger.logError({number: rfid}, err)
        res.status(500).send(""+err).end()
      })
      .finally( () => {
        Door.open().catch(err => {
          logger.logError({number: rfid}, err)
          Door.close().catch(err => {
            logger.logError({number: rfid}, err)
          })
        })
      })

  }).catch(err => {
    logger.logError({number: rfid}, err)
    res.status(500).send(""+err).end()
  })
}

function reponse(req,res,path,success,data) {
  if(/application\/json/.test(req.get('accept'))) {
    res.json({"success":success, "path":path, "data": data}).end()
  } else {
    res.redirect(path).end()
  }
}
