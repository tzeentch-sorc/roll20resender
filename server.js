// server.js
const express = require('express');
const axios = require('axios');
const http = require('http');
const WebSocket = require('ws');
const { DISCORD_WEBHOOK_URL } = require('./config.json');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const wssDiscord = new WebSocket.Server({ port: 8081 });
let goClient = null;


app.use(express.json());

let socketClients = [];

wss.on('connection', ws => {
    socketClients.push(ws);
    console.log('Extension connected');

    ws.on('close', () => {
        socketClients = socketClients.filter(client => client !== ws);
        console.log('Extension disconnected');
    });
});

wssDiscord.on("connection", (ws) => {
    console.log("Go webhook handler connected");
    goClient = ws;
});

app.post('/roll', (req, res) => {
    const message = req.body.faceValue || '/me 🎲 rolls a die!';
    console.log('Sending to extension:', message);
    socketClients.forEach(ws => ws.send(JSON.stringify({ message })));
    res.send({ status: 'sent' });
});

app.post('/discord', async (req, res) => {
    console.log(DISCORD_WEBHOOK_URL);
    const data = req.body;
    if (!data.content) {
        data.content = `🎲${data.embeds[0].description || ''} rolls a die!`;
    }
    data.embeds[0].description = "Here is what magic of programming can do";
    console.log('Sending to discord:', data.embeds[0].title);
    try {
        if (goClient && goClient.readyState === WebSocket.OPEN) {
            goClient.send(JSON.stringify({ DISCORD_WEBHOOK_URL, data, headers: { 'Content-Type': 'application/json' } }));
        } else {
            throw new Error("Go handler not connected");
        }
    } catch (error) {
        console.error('Ошибка при отправке в Discord:', error.message);
        res.status(500).send({ status: 'error', message: error.message });
    }
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
