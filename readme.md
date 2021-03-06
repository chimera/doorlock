# Chimera Doorlock

## Overview

-   Cards are synced with Cobot
-   Cards are stored in `cards.json` in the root of the project (should be `~/doorlock/cards.json` on the RaspberryPi)
-   Logs are stored in `logs.json` in the root of the project (should be `~/doorlock/logs.json` on the RaspberryPi)

## TODO

-   [x] Update list of cards every few minutes from Cobot
-   [x] Push up logs/checkins to management app
-   [ ] Get working with Nexedus
-   [ ] Protect card and log pages such that people can't just login to the wifi and copy-paste card ID numbers into the form
-   [ ] Handle card reading directly in hardware, no ability to manually type into the webform
-   [ ] Log error messages and other app issues remotely

# Setting up Cobot

- Register a new application at https://www.cobot.me/oauth2_clients
- Set the Scope to `checkin_tokens write write_check_ins read read_time_passes`
- Paste the Access Token (used for dev / non-interactive purposes) into the COBOT_ACCESS_TOKEN variable in `.env` (based on `.env.example` -- see below instructions)

# Developing

- Install dependencies with `npm install`
- Run `node src/server.js`

# Configuring Raspberry Pi

First, get a working RasPi. I suggest Raspbian (not NOOBS). Download and extract the ZIP. Then follow standard instructions to "burn" image to SD card. On Linux/Mac, that'd be something like: (**TRIPLE CHECK THE IF AND OF HERE BEFORE COPY PASTING, ESPECIALLY OF=/dev/sdb BECAUSE ALL CONTENTS WILL BE INSTANTLY OVERWRITTEN DESTRUCTIVELY**) `sudo dd if=2018-11-13-raspbian-stretch-full.img of=/dev/sdb bs=1M`

On the RPI:

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

Follow the [install from source guide for node-hid](https://github.com/node-hid/node-hid#compiling-from-source) becuase there is no pre-built binary for RaspberryPi

```
npm install -g node-gyp
apt install build-essential git libudev-dev gcc-4.8 g++-4.8 libusb-1.0-0 libusb-1.0-0-dev
export CXX=g++-4.8
npm install node-hid --build-from-source
```

You should now be able to view the app at http://localhost:3000

## Autostart

On a RasPi, copy the contents of the autostart file into: `~/.config/lxsession/LXDE-pi/autostart` (presuming you've downloaded this repo to `/home/pi/doorlock`. Note that autostart is the filename, not a folder. Messing this up will prevent you from logging in fully.)

Also, add the full `cron.sh` path to `/etc/crontab` to run every 5 minutes, i.e. `*/5 *   * * *   root    /home/pi/doorlock/cron.sh`

Optionally, to help users with debugging, run `ln -s /home/pi/doorlock/start.sh ~/Desktop/start-doorlock.sh` to give them a link on the desktop.

Or generally, find some way to run `./start.sh` in this folder

## Further reading

-   [USB Relay library](https://github.com/darrylb123/usbrelay)
-   https://obrienlabs.net/setup-raspberry-pi-kiosk-chromium/

## Contributing

Contributions welcome!

Want to contribute? Submit a Pull Request with your changes!

Using this in your own project? Let us know by creating an issue in Github!

## Credits

Developed by [Dana Woodman][dana] &copy; 2018. Modified by [Will Bradley][zyphlar] 2019.

## License

MIT

[cobot]: https://www.cobot.me/
[dana]: http://danawoodman.com
[jest]: https://facebook.github.io/jest
[latch]: https://www.amazon.com/gp/product/B00V45GWTI
[relay]: http://a.co/d/hbuockB
[zyphlar]: https://github.com/zyphlar
