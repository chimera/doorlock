# Chimera Doorlock

## Overview

-   Cards are synced with Cobot
-   Cards are stored in `cards.json` in the root of the project (should be `~/doorlock/cards.json` on the RaspberryPi)
-   Logs are stored in `logs.json` in the root of the project (should be `~/doorlock/logs.json` on the RaspberryPi)

## TODO

-   [ ] Handle card reading directly in hardware, no ability to manually type into the webform
-   [ ] Protect card and log pages such that people can't just login to the wifi and copy-paste card ID numbers into the form, and can't break the system just by clicking around
-   [ ] Log error messages and other app issues remotely

### Mothballed

-   [ ] Get working with Nexedus

## Configuring Raspberry Pi

First, obviously set up the RasPi like normal, with Raspbian, WiFi, keyboard, SSH/VNC, etc.

```bash
# Change to "sudo" user
sudo su

# Install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

# Install forever
npm i -g forever

# Clone the project and install dependencies
cd ~
git clone https://github.com/chimera/doorlock.git
cd doorlock
nvm install
nvm use
npm install

# Setup environment variables
cp .env.example .env
vi .env
# Add missing environment variables

# Start app
forever start src/server.js
```

To make the card reader work, follow the [install from source guide for node-hid](https://github.com/node-hid/node-hid#compiling-from-source) becuase there is no pre-built binary for RaspberryPi, as follows:

```bash
npm install -g node-gyp
apt install build-essential git libudev-dev gcc-4.8 g++-4.8 libusb-1.0-0 libusb-1.0-0-dev
export CXX=g++-4.8
npm install node-hid --build-from-source
```

You should now be able to view the app at http://localhost:3000

### Autostart

On a RasPi, copy the contents of the autostart file into: `~/.config/lxsession/LXDE-pi/autostart` (presuming you've downloaded this repo to `/home/pi/doorlock`)

Optionally, to help users with debugging, run `ln -s /home/pi/doorlock/start.sh ~/Desktop/start-doorlock.sh` to give them a link on the desktop.

Or generally, find some way to run `./start.sh` in this folder

### RasPi Touchscreen Setup

#### Screen

If you're using the WaveShare 7" HDMI LCD (C) that Chimera bought, you need to set specific screen resolution and frequency settings otherwise the LCD will freak out and, if left connected for hours, physically damage itself.

- Edit Raspbian's `/boot/config.txt` (which should already exist and have screen-related settings, mostly commented-out)
- Add to the bottom this exact text:

```bash
# Waveshare 7" LCD settings
max_usb_current=1
hdmi_group=2
hdmi_mode=87
hdmi_cvt 1024 600 60 6 0 0 0
hdmi_drive=1
```

- The RasPi will need a reboot to apply these settings. If the screen is still looking weird, it may need to sit completely unplugged for a few hours to go back to normal.

#### Onscreen Keyboard

- Install the onscreen keyboard: `sudo apt install matchbox-keyboard`

### Using Chromium in Kiosk Mode

- The `autostart` and `start.sh` files should take care of this, but they are based on the instructions at https://obrienlabs.net/setup-raspberry-pi-kiosk-chromium/ in case you get stuck.

## Developing

- After installing dependencies per the instructions above, either use `forever` (see `start.sh` for examples) or just run `node src/server.js`

## Further reading

-   [USB Relay library](https://github.com/darrylb123/usbrelay)

## Contributing

Contributions welcome!

Want to contribute? Submit a Pull Request with your changes!

Using this in your own project? Let us know by creating an issue in Github!

## Credits

Developed by [Dana Woodman][dana] with help from [Will Bradley][zyphlar] &copy; 2018.

## License

MIT

[dana]: http://danawoodman.com
[zyphlar]: https://gitlab.com/zyphlar
[cobot]: https://www.cobot.me/
[jest]: https://facebook.github.io/jest
[latch]: https://www.amazon.com/Trine-Access-Stainless-Surface-Electric/dp/B00EZWRTRQ/ (Trine 4850-32D 1/2" surface mount rim panic electric strike)
[relay]: https://www.amazon.com/dp/B071XHF67G/ (KNACRO SRD-05VDC-SL-C 2-Way 5V Relay Module Free Driver USB Control Switch PC Intelligent Control)
[touchscreen]: https://www.amazon.com/dp/B015E8EDYQ/ (Waveshare 7 inch 1024600 Capacitive Touch Screen LCD Display HDMI)
