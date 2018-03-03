class Display {
  static successMessage(msg) {
    console.log('SUCCESS', msg)
  }

  static failureMessage(msg) {
    console.log('FAILURE', msg)
  }
}

module.exports = Display
