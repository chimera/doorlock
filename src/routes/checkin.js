const Cards = require('../models/cards')
const Door = require('../models/door')
const logger = require('../models/logger')
const Cobot = require('../models/cobot')

module.exports = async (req, res) => {
  try {
    // Cleanup the RFID value so it is consistent.
    const number = req.body.rfid.trim().toLowerCase()
    console.log('SCANNED CARD:', number)

    // Validate that the card exists in our local database
    // of member cards.
    const card = await Cards.validate(number)
    console.log('CARD:', card)

    // If the card doesn't exist, the RFID is considered inactive or
    // invalid, so we let them know via the failure page.
    if (!card) {
      logger.logRejectedCard({ number })      
      res.format({
        json: () => res.json({ success: false, path: '/failure', { number } }),
        default: () => res.redirect('/failure')
      })
      return
    }

    logger.logGrantedCard(card)

    // Open the door assuming they are authenticated.
    const door = await Door.open()

    // Return a response before reporting checkin to Cobot
    // so the door opens quickly.
    const path = `/success?name=${card.name}`
    res.format({
      json: () => res.json({ success: true, path, { name: card.name } }),
      default: () => res.redirect(path)
    });

    // Check the user into Cobot
    await Cobot.doCheckin(card)
  
  } catch (error) {
    logger.logError({ number }, error)
    res.format({
      json: () => res.json({ success: false, path: '/failure', { number } }),
      default: () => res.send(`ERROR: ${error}`)
    });
  }
}
