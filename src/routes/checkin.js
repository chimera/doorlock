const Cards = require('../models/cards')
const Door = require('../models/door')
const logger = require('../models/logger')

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
    Door.open().then(resp => {
      reponse(req,res,'/success?name=' + card.name,true,card.name)
    }).catch(err => {
      logger.logError(card, err.message)
      res.status(500).send("Error: "+err)
    })
  }).catch(err => {
    logger.logError({number: rfid}, err.message)
    res.status(500).send("Error: "+err)
  })
}

function reponse(req,res,path,success,name=null,message=null) {
  if(/application\/json/.test(req.get('accept'))) {
    res.json({"success":success, "path":path, "name":name, "message": message})
  } else {
    res.redirect(path)
  }
}