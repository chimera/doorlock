# Chimera Doorlock

> A Tessel powered RFID doorlock for the space, interfacing with Cobot

Powered by a [Tessel][tessel]

## Development

Follow the [start guide][start] on [Tessel.io][tessel].

Install the correct version of node using nvm:

```bash
nvm install
nvm use
npm install
```

Now install `t2-cli` globally:

```bash
npm install -g t2-cli
```

Plug your Tessel in.

Now you can deploy to your connected Tessel device:

```bash
npm start
```

### Testing

We use [Jest][jest] to do testing of the core code in the library. Make sure to write tests for new code or update tests on existing code as needed. Test files are next to their source file named with a `.test.js` extension.

Run tests once: `npm test`

Run tests watching for changes: `npm run watch-test`

### RFID Cards

Read cards from Cobot:

<https://www.cobot.me/api-docs/check-ins#list-check-in-tokens>

### Useful Commands

```bash
# Connect to WiFi
t2 wifi -n network-name -p "some password"

# List devices
t2 list

# Update Tessel
t2 update

# Deploy code
t2 push index.js

# Clear code
t2 erase

# Create access point and server
t2 ap -n doorlock
```

### Networking

To find the IP address of your Tessel, download the iOS app Fing and look for a device on your network called `doorlock`.

### USB Storage

*   Make sure to format USB to be FAT32!

[jest]: https://facebook.github.io/jest
[start]: http://tessel.github.io/t2-start
[tessel]: http://tessel.io
