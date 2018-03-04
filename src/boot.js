const Cobot = require('./models/cobot')

Cobot.authorize().then(cobot => {
  cobot.cards().then(resp => console.log('RESP:', resp))
})

// const server = require('./server')

// server()

// const Cards = require('./models/cards')
// const Door = require('./models/door')

// Door.open()

// Cards.update()

// const server = require('./server')

// doorlock.updateCards()
// server()

// const HID = require('node-hid')

// choose driverType
// default is 'libusb' for Mac OSX & Windows
// default is 'hidraw', for Linux
// let type = null

// if (process.argv[2]) {
//   type = process.argv[2]
// }
// disabled until prebuild gets multi-target, see issue node-hid#242
// console.log('driverType:', (type) ? type : 'default');
// HID.setDriverType( type );

// console.log('devices:', HID.devices())
