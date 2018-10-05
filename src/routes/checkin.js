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

    Door.open()
      .then(door => {
        data = {"name": card.name} //, "remaining": checkin.valid_until}
        reponse(req,res,`/success?name=${card.name}`,true,data)
      }).catch(err => {
        logger.logError(card, err)
        res.status(500).send("Error: "+err).end()
      })

    Cobot.doCheckin(card)
      .catch(err => {
        logger.logError({number: rfid}, err)
        // reponse(req,res,`/failure`,false,err)
      })
      // .then(checkin => {
      // })
  }).catch(err => {
    logger.logError({number: rfid}, err)
    res.status(500).send("Error: "+err).end()
  })
}

function reponse(req,res,path,success,data) {
  if(/application\/json/.test(req.get('accept'))) {
    res.json({"success":success, "path":path, "data": data}).end()
  } else {
    res.redirect(path).end()
  }
}
