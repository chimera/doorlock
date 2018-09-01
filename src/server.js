const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const moment = require('moment')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 3000

//---------------------------------------------------------
// Middleware
//---------------------------------------------------------

// View engine setup
app.set('views', path.join(process.cwd(), 'src', 'views'))
app.set('view engine', 'pug')

// Handle form body content
app.use(bodyParser.urlencoded({ extended: true }))

// Handle static assets in /public
app.use(express.static(path.join(process.cwd(), 'public')))

// Security middleware
app.use(helmet())

// Allow moment to be used in templates
app.locals.moment = moment

//---------------------------------------------------------
// Routes
//---------------------------------------------------------

app.post('/checkin', require('./routes/checkin'))
app.get('/success', require('./routes/success'))
app.get('/failure', require('./routes/failure'))
app.get('/cards', require('./routes/cards'))
app.get('/logs', require('./routes/logs'))
app.get('/update', require('./routes/update'))
app.get('/', (req, res) => res.render('home', {}))

app.listen(PORT, () => console.log('Example app listening on port 3000!'))
