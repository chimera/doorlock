function LED() {
  return {
    off: jest.fn(),
    on: jest.fn(),
  }
}

const tessel = {
  led: {
    0: LED(), // red
    1: LED(), // amber
    2: LED(), // green
    3: LED(), // blue
  },
}

module.exports = tessel
