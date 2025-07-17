# How to use

1. `npm install` - to install deps
2. `node server.js` - to run a server that will handle rolls.
You`ll need a Pixels app that will send requests from dice (I just send it to local network ip address)
3. Create file config.json, you may rename config.example.json

## Roll20

`http://192.168.x.x:3000/roll`

1. Install extension (roll20-chat-injector) to browser
2. Enable it and run roll20 game
3. Open chat, roll the die and see it pasting messages

## Discord

`http://192.168.x.x:3000/discord`

1. Initialize Webhook in Discord channel.
2. Copy Webhook link and paste it in config.json
3. For better experience insert your Discord user ID in Value field (e.g. `<@idnumber>`)
4. Open chat, roll the die and see it pasting messages
