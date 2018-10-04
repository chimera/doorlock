const HID = require('node-hid')
const devices = HID.devices()
console.log(devices)


const vid = 5824
const pid = 1503
const device = new HID.HID(vid, pid)


const all_on = 0xfe
const all_off = 0xfc

const on = 0xff
const off = 0xfd

const relay_null = 0x00
const relay1 = 0x01
const relay2 = 0x02

const DELAY = 6000

setTimeout(() => {
  console.log("off")
  device.sendFeatureReport([all_off, relay_null])
}, DELAY)
setTimeout(() => {
  console.log("off")
  device.sendFeatureReport([all_off, relay_null])
}, DELAY+50)
setTimeout(() => {
  console.log("on")
  device.sendFeatureReport([all_on, relay_null])
}, DELAY+100)
setTimeout(() => {
  console.log("on")
  device.sendFeatureReport([all_on, relay_null])
}, DELAY+150)
setTimeout(() => {
  console.log("off")
  device.sendFeatureReport([all_off, relay_null])
}, DELAY+200)
setTimeout(() => {
  console.log("on")
  device.sendFeatureReport([all_on, relay_null])
}, DELAY+250)
setTimeout(() => {
  console.log("off")
  device.sendFeatureReport([all_off, relay_null])
}, DELAY+300)
