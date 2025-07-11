// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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

app.post('/roll', (req, res) => {
    const message = req.body.faceValue || '/me 🎲 rolls a die!';
    console.log('Sending to extension:', message);
    socketClients.forEach(ws => ws.send(JSON.stringify({ message })));
    res.send({ status: 'sent' });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
