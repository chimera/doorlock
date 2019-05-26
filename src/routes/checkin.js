const Cards = require('../models/cards')
const Door = require('../models/door')
const logger = require('../models/logger')
const Cobot = require('../models/cobot')
var io = null;

module.exports = (req, res) => {
  io = req.app.get('socketio')

  const rfid = req.body.rfid.trim().toLowerCase()
  console.log('SCANNED CARD:', rfid)

  Cards.validate(rfid).then(card => {
    console.log('CARD:', card)
    if (!card) {
      logger.logInvalidCard({number: rfid})
      return response(req,res,'/failure',false,"Card was not recognized as valid.")
    }

    logger.logValidCard(card)

    Cobot.doCheckin(card).then(checkin => {
      Cobot.doCheckTimepasses(card).then(time_passes => {
        // TODO: figure out how to differentiate between "0 passes remaining" and "your plan doesn't support time passes"
        // if (time_passes.unused_count === 0) {
        //   remaining = undefined;

        remaining = time_passes.unused_count;
        data = {"name": checkin.name, "remaining": remaining, "checkin":checkin, "time_passes": time_passes}
        console.log(data)
        response(req,res,`/success?name=${checkin.name}`,true,data)
      })
      .catch(err => {
        logger.logError({number: rfid}, err)
        response(req,res,null,false,err.toString(),500)
      })

      logger.logGrantedCard(card)

      Door.open().catch(err => {
        logger.logError({number: rfid}, err)
        Door.close().catch(err => {
          logger.logError({number: rfid}, err)
        })
      })
    })
    .catch(err => {
      logger.logError(card, err)
      response(req,res,null,false,err.toString(),500)
    })
  }).catch(err => {
    logger.logError({number: rfid}, err)
    response(req,res,null,false,err.toString(),500)
  })
}

function response(req,res,path,success,data,status) {
  console.log("sending response", path,success,data,status)
  if(status==500){
    res.status(status).send(data).end()
  } else {
    if(/application\/json/.test(req.get('accept'))) {
      res.json({"success":success, "path":path, "data": data}).end()
    } else {
      res.redirect(path).end()
    }
  }
  io.emit('checkin', { for: 'everyone', data, success })
}
