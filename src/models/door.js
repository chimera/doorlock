const { Board } = require('easy-usb-relay')

const DELAY = 6000

module.exports = class Door {
  static open() {
    return new Promise(success => {
      console.log('OPEN DOOR!')
      const board = new Board(2)
      success(board.allOn())
      setTimeout(() => {
        console.log('CLOSING DOOR!')
        board.allOff()
      }, DELAY)
    })
  }

  static close() {
    return new Promise(success => {
      console.log('CLOSING DOOR!')
      const board = new Board(2)
      success(board.allOff())
    })
  }
}
