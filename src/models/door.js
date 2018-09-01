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
        success()
      }, DELAY)
    })
  }

  // static close() {
  //   console.log('CLOSE DOOR!!!!!!!!!!!!')
  // }
}
