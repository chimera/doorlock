const fs = require('fs')
const logger = require('../utils/logger')

class SDCard {
  static read(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) return reject(err)
        // logger.log('READ:', data.toString())
        resolve(JSON.parse(data))
      })
    })
  }

  static write(filePath, json) {
    const text = JSON.stringify(json)
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, text, err => {
        if (err) return reject(err)
        // logger.log('WROTE:', json)
        resolve()
      })
    })
  }
}

module.exports = SDCard
