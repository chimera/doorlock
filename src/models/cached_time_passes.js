const fs = require('fs')
const path = require('path')
const moment = require('moment')

const PASSES_PATH = path.join(process.cwd(), 'cached_time_passes.json')

module.exports = class CachedTimePasses {

  static all() {
    return new Promise((resolve, reject) => {
      try {
        var passes = fs.readFileSync(PASSES_PATH, "utf8")
      } catch (e) {
        // default empty file structure
        var passes = "{'lastUpdated':null, 'passes': []}"
        // create file if doesn't exist
        fs.writeFileSync(PASSES_PATH, passes)
      }
      var out = JSON.parse(passes)
      resolve(out)
    })
  }

  static write(passes) {
    const json = JSON.stringify(this.sortByName(passes))
    console.log('WRITING PASSES:', json)
    return new Promise((resolve, reject) => {
      fs.writeFile(PASSES_PATH, json, err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  static isCacheValid() {
    return this.all().then(passes => {
        return moment().utc(passes['lastUpdated']).isAfter(
          moment().utc().subtract(12, 'hours')
        )
      }
    )
  }

  static get(number) {
    return this.all().then(passes =>
      passes.find(c => parseInt(c.number, 10) === parseInt(number, 10))
    )
  }

}
