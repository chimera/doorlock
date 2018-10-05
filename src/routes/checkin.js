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
        Door.open()
          .finally(door => {
            data = {"name": card.name, "remaining": checkin.valid_until}
            reponse(req,res,`/success?name=${card.name}`,true,data)
          }).catch(err => {
            logger.logError(card, err)
            // res.status(500).send("Error: "+err)
          })
      })
      .catch(console.error)
  }).catch(err => {
    logger.logError({number: rfid}, err)
    res.status(500).send("Error: "+err)
  })
}

function reponse(req,res,path,success,data) {
  if(/application\/json/.test(req.get('accept'))) {
    res.json({"success":success, "path":path, "data": data})
  } else {
    res.redirect(path)
  }
}
