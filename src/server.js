const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const moment = require('moment')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
app.set('socketio', io)

// const timeout = require('connect-timeout')
// function haltOnTimedout (req, res, next) {
//   if (!req.timedout) next()
// }

const PORT = process.env.PORT || 3000

//---------------------------------------------------------
// Middleware
//---------------------------------------------------------

// Time out after 10 secs
// app.use(timeout('10s'))
app.use(function(req, res, next){
  req.setTimeout(20000) // 20sec timeout
  next()
})

// View engine setup
app.set('views', path.join(process.cwd(), 'src', 'views'))
app.set('view engine', 'pug')
// app.use(haltOnTimedout)

// Handle form body content
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(haltOnTimedout)

// Handle static assets in /public
app.use(express.static(path.join(process.cwd(), 'public')))
// app.use(haltOnTimedout)

// Security middleware
app.use(helmet())
// app.use(haltOnTimedout)

// Allow moment to be used in templates
app.locals.moment = moment
// app.use(haltOnTimedout)


//---------------------------------------------------------
// Begin by locking door, you never know.
//---------------------------------------------------------

try {
    const { Board } = require('easy-usb-relay')
    const board = new Board(2)
    console.log('Booting up. Locking door just in case.')
    board.allOff()
} catch (err) {
    console.log("Warning: "+err.message)
}

//---------------------------------------------------------
// Routes
//---------------------------------------------------------

app.post('/checkin', require('./routes/checkin'))
app.get('/success', require('./routes/success'))
app.get('/failure', require('./routes/failure'))
app.get('/cards', require('./routes/cards'))
app.get('/logs', require('./routes/logs'))
app.get('/update', require('./routes/update'))
app.get('/update_nexudus', require('./routes/update_nexudus'))
app.get('/', (req, res) => res.render('home', {}))


//---------------------------------------------------------
// HTTP
//---------------------------------------------------------


http.listen(PORT, function(){
  console.log('Doorlock app listening at http://localhost:'+PORT+' !')
})

//---------------------------------------------------------
// Websocket
//---------------------------------------------------------

io.on('connection', function(socket){
  io.emit('checkin', { for: 'everyone' })
  // io.emit('checkin', 'hi')
  console.log('WS user connected');
})


// io.on('connection', client => {
//   client.on('event', data => { 1234 })
//   // client.on('disconnect', () => { /* … */ })
// })
