const fs = require('fs')
const path = require('path')

const LOGS_PATH = path.join(process.cwd(), 'logs.json')

module.exports = class Logs {
  static all() {
    return new Promise((resolve, reject) => {
      fs.readFile(LOGS_PATH, (err, data) => {
        if (err) return resolve(JSON.parse("[]"))
        resolve(JSON.parse(data))
      })
    })
  }

  static write(logs) {
    const json = JSON.stringify(logs)
    return new Promise((resolve, reject) => {
      fs.writeFile(LOGS_PATH, json, err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  static log(access) {
    return this.all().then(all => {
      all.push(access)
      return this.write(all)
    })
  }
}
