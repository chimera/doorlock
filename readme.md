# Chimera Doorlock

Powered by a [Tessel][tessel]

## Development

Follow the [start guide][start] on [Tessel.io][tessel].

Install `t2-cli` globally:

```bash
npm install -g t2-cli
```

Now install the correct version of node using nvm:

```bash
nvm install
nvm use
npm install
```

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

### USB Storage

*   Make sure to format USB to be FAT32!

[start]: http://tessel.github.io/t2-start
[tessel]: http://tessel.io
