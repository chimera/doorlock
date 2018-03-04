# Chimera Doorlock

> A Tessel powered RFID doorlock for the space, interfacing with Cobot

## Technical Overview

The RFID doorlock consists of a few components that allow us to have a offline capable, yet up-to-date list of member's RFID cards:

*   Tessel microcontroller powered by node.js
*   USB RFID reader (125khz)
*   SD card for storing RFID numbers
*   OLED display
*   12v industrial door latch (default locked)
*   Software to fetch cards, display messages and do validation and open the door

Currently, we are using [Cobot][cobot] to manage our membership as well as RFID card numbers (checkin tokens in Cobot parlance).

Eventually, we can remove Cobot and swap it with our own service if we desire.

#### Tessel Microcontroller

The doorlock consists of a [Tessel][tessel] microcontroller powered by node.js (JavaScript).

#### USB SD Card List

The doorlock has an attached USB adapter with an SD card to store the member's cards (in `json` format).

#### USB RFID Reader

A USB powered RFID card reader (125khz) is plugged into the other Tessel USB port. This reader behaves like a keyboard; when a card is scanned it sends a string of card numbers as keys with a newline character.

The application listens for card scan events and when one if found, it looks the card number up in a local database (the above mentioned `json` file). If it finds a card, it opens the door, if not it shows an error message.

#### Door Latch

To open the door, we use a relay (or optionally a TIP120 transistor) which powers a [12v door latch][latch]. If no power is sent to the door latch, it remains locked. When it gets a 12v current it opens and allows the member entry.

#### OLED Display

Whether a success or failure, we show details on an attached OLED display as well as when the card list updates or other unexpected issues.

#### RFID Card Sync

When the device first turns on it connects to WiFi and then fetches all the member RFID cards from the Cobot checkin token API and then updates the `json` card file. It completely overwrites the existing list of cards. If there is a failure getting the cards, we keep the original card list as a fallback.

We periodically sync this list every few minutes (configurable).

#### Access Log

We log every door open event so we can keep and eye on usage. We log an entry containing the member name, datetime and RFID card number in a `json` file. This list is sent to Cobot periodically so we can create a "checkin" for a member. Once the list is pushed successfully we clear out the file.

## Development

First, follow the [start guide][start] on [Tessel.io][tessel].

Next, install the correct version of node using nvm:

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
npm run deploy
```

For local development, you can run:

```bash
npm start
```

...which will run the application locally as well as run the test suite, watching for changes.

## Testing

We use [Jest][jest] to do testing of the core code in the library. Make sure to write tests for new code or update tests on existing code as needed. Test files are next to their source file named with a `.test.js` extension.

Run tests once:

```bash
npm test
```

Run tests watching for changes:

```bash
npm run watch-test
```

## Useful Details

### Useful Commands

```bash
# List devices
t2 list

# Update Tessel
t2 update

# Deploy code
t2 push index.js

# Clear code
t2 erase

# Connect to WiFi
t2 wifi -n network-name -p "some password"

# Create access point and server
t2 ap -n doorlock
```

### Networking

To find the IP address of your Tessel, download the iOS app Fing and look for a device on your network called `doorlock`.

### USB Storage

*   Make sure to format micro SD to be FAT32!

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
[tessel]: http://tessel.io
