~/.nvm/versions/node/v10.6.0/bin/forever stopall
~/.nvm/versions/node/v10.6.0/bin/forever start --workingDir /home/pi/doorlock /home/pi/doorlock/src/server.js
echo "Loading Browser..."
sleep 5
chromium-browser --kiosk localhost:3000
