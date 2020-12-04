~/.nvm/versions/node/v10.6.0/bin/forever stopall
rm ./node.log
rm ./node_err.log
~/.nvm/versions/node/v10.6.0/bin/forever start -l ./forever.log -o ./node.log -e ./node_err.log -a --workingDir /home/pi/doorlock /home/pi/doorlock/src/server.js
echo "Loading Browser..."
sleep 5
chromium-browser --incognito --kiosk --app=http://localhost:3000
