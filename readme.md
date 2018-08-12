# Chimera Doorlock

## TODO

-   [ ] Update list of cards every few minutes
-   [ ] Push up logs/checkins to management app
-   [ ] Handle error message

## Configuring Raspberry Pi

On the RPI:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

# Install the USB relay driver
# sudo apt-get install usbrelay

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

You should now be able to view the app at

Place this at the bottom of your `~/.bashrc` file:

```bash
forever start ~/doorlock/src/server.js
chromium-browser --kiosk localhost:3000
```

## Further reading

-   [USB Relay librar](https://github.com/darrylb123/usbrelay)
-   https://obrienlabs.net/setup-raspberry-pi-kiosk-chromium/

## Contributing

Contributions welcome!

Want to contribute? Submit a Pull Request with your changes!

Using this in your own project? Let us know by creating an issue in Github!

## Credits

Developed by [Dana Woodman][dana] &copy; 2018.

## License

MIT

[cobot]: https://www.cobot.me/
[dana]: http://danawoodman.com
[jest]: https://facebook.github.io/jest
[latch]: https://www.amazon.com/gp/product/B00V45GWTI
[start]: http://tessel.github.io/t2-start
