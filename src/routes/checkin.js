const Cards = require('../models/cards')
const Door = require('../models/door')
const Logs = require('../models/logs')

module.exports = (req, res) => {
  const rfid = req.body.rfid.trim().toLowerCase()
  console.log('SCANNED CARD:', rfid)

  Cards.validate(rfid).then(card => {
    console.log('CARD:', card)
    if (!card) return reponse(req,res,'/failure',false)

    reponse(req,res,'/success?name=' + card.name,true,card.name)
    Logs.log({ timestamp: new Date().getTime(), card }).then(() =>
      console.log('Logged!')
    )
    Door.open()
  }).catch(err => {
    reponse(req,res,'/failure',false)
    Logs.log({ timestamp: new Date().getTime(), err}).then(() =>
      console.log('Undefined failure: '+err)
    )
  })
}

function reponse(req,res,path,success,name=null) {
  console.log(req.get('accept'));
  if(/application\/json/.test(req.get('accept'))) {
    res.json({"success":success, "path":path, "name":name})
  } else {
    res.redirect(path)
  }
}