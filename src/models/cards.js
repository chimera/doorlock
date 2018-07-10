const fs = require('fs')
const path = require('path')

const CARDS_PATH = path.join(process.cwd(), 'cards.json')

module.exports = class Cards {
  static all() {
    return new Promise((resolve, reject) => {
      fs.readFile(CARDS_PATH, (err, data) => {
        if (err) return reject(err)
        resolve(JSON.parse(data))
      })
    })
  }

  static write(cards) {
    const json = JSON.stringify(this.sortByName(cards))
    return new Promise((resolve, reject) => {
      fs.writeFile(CARDS_PATH, json, err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  static validate(number) {
    return this.all().then(cards => cards.find(c => c.number === number))
    // console.log(':', JSON.stringify(number.toString().trim()))
    // const scanned = parseInt(
    //   number
    //     .toString('hex')
    //     .trim() // Remove any whiespace or newlines
    //     .replace('\u0003', '') // Remove "end of text" character
    //     .replace('\u0002', '') // Remove "start of text" character
    //     .substring(3) // Strip off con
    //     .slice(0, -2), // Strip off checksum
    //   16
    // )

    // this.log('Scanned card:', scanned)

    // return this.readCardsFromSDCard().then(cards => {
    //   const card = cards.find(c => parseInt(c.number) === scanned)

    //   if (card) {
    //     const name = card.name.split(' ')[0]
    //     this.log(`Welcome in ${name}!`, scanned)
    //     this.openDoor()
    //   } else {
    //     this.log('Card is invalid:', scanned)
    //   }
    // })
  }

  static sortByName(cards) {
    return cards.sort(
      (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
    )
  }
}
