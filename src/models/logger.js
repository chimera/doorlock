var winston = require('winston'); // for transports.Console
const fs = require('fs')
const path = require('path')
const LOGS_PATH = path.join(process.cwd(), 'logs.log')

var winston = winston.createLogger({
    transports: [
        new (winston.transports.Console)({ level: 'debug' }),
        new (winston.transports.File)({ filename: 'logs.log', level: 'debug' })
    ]
});

winston.logError = function(card, message) {
  winston.log({
    level: 'error',
    message: message.toString(),
    timestamp: new Date().getTime(),
    card: card,
  })
}

winston.logValidCard = function(card) {
  winston.log({
    level: 'info',
    message: 'valid',
    timestamp: new Date().getTime(),
    card: card
  })
}

winston.logInvalidCard = function(card) {
  winston.log({
    level: 'info',
    message: 'invalid',
    timestamp: new Date().getTime(),
    card: card
  })
}

winston.logGrantedCard = function(card) {
  winston.log({
    level: 'info',
    message: 'granted',
    timestamp: new Date().getTime(),
    card: card
  })
}

winston.logDeniedCard = function(card) {
  winston.log({
    level: 'info',
    message: 'denied',
    timestamp: new Date().getTime(),
    card: card
  })
}

winston.readLogs = function () {
  return new Promise((resolve, reject) => {
    // specify "utf8" to return a string
    fs.readFile(LOGS_PATH, "utf8", (err, data) => {
      if (err) return resolve(JSON.parse("[]"))
      try {
        var out = []
        var split = data.split("\n")
        // console.log(split)
        for(var i=0; i<split.length; i++){
          var line=split[i]
          try {
            if (line) {
              // console.log(line)
              myLine = JSON.parse(line);
              // console.log(myLine)
              if (myLine.timestamp) {
                out.push(myLine)
              }
            }
          } catch (err) {
            console.log("Error reading log line: "+line+" - "+err)
          }
        }
        // console.log(out)
        resolve(out)
      } catch (err) {
        return resolve(JSON.parse("[]"))
      }
    })
  })
}

module.exports = winston
