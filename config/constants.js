const ENV = process.env.NODE_ENV || 'development'
const DOOR_OPEN_DELAY = ENV === 'test' ? 1 : 6000 // in milliseconds

module.exports = {
  DOOR_OPEN_DELAY,
}
