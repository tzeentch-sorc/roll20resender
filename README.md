# How to use

1. `npm install` - to install deps
2. go to discord-webhook-handler and run `go build -o discord-webhook-handler.exe main.go`
3. `node server.js` - to run a server that will handle rolls.
You`ll need a Pixels app that will send requests from dice (I just send it to local network ip address)
4. Create file config.json, you may rename config.example.json

## Roll20

`http://192.168.x.x:3000/roll`

1. Install extension (roll20-chat-injector) to browser
2. Enable it and run roll20 game
3. Open chat, roll the die and see it pasting messages

## Discord

`http://192.168.x.x:3000/discord`

1. Initialize Webhook in Discord channel.
2. Copy Webhook link and paste it in config.json
3. Run the server, then run discord-webhook-handler.exe
4. For better experience insert your Discord user ID in Value field (e.g. `<@idnumber>`) in Pixels App
5. Open chat, roll the die and see it pasting messages

-> For VPN purposes you should enable app-based split tunneling and add discord-webhook-handler.exe to VPN whitelist
This should resolve the issue with local proxy.
-> If you use blacklist instead, make sure that the app running your server.js (e.g. VSCode) is in the list of apps that SOULD NOT have access via VPN

> Note: Pixels → {No VPN REST local} →  server.js → WebSocket → discord-webhook-handler.exe → {Yes VPN REST global} →  Discord webhook
