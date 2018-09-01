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
    console.log('WRITING CARDS:', json)
    return new Promise((resolve, reject) => {
      fs.writeFile(CARDS_PATH, json, err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  static validate(number) {
    return this.all().then(cards =>
      cards.find(c => parseInt(c.number, 10) === parseInt(number, 10))
    )
  }

  static sortByName(cards) {
    return cards.sort(
      (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
    )
  }
}
