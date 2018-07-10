module.exports = class Logs {
  static all() {
    return Promise.all([
      {
        timestamp: 1531256719431,
        card: { name: 'John Smith', number: '1234023423423' },
      },
      {
        timestamp: 1531256756227,
        card: { name: 'Jane Doe', number: '2394723984752983' },
      },
    ])
  }
}
