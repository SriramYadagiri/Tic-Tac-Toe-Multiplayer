const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const connections = [null, null];

io.on('connection', socket => {
    // console.log('New websocket connection!');

    let playerInd = -1;
    for (let i = 0; i < connections.length; i++) {
        if (connections[i] == null) {
            playerInd = i;
            break;
        }
    }

    socket.emit('player-number', playerInd);
    console.log(`Player ${playerInd} has connected!`);
    if (playerInd == -1) return;

    connections[playerInd] = false;
    socket.broadcast.emit('player-connection', playerInd);

    socket.on('disconnect', function() {
        console.log(`player ${playerInd} has disconnected.`);
        connections[playerInd] = null;
        socket.broadcast.emit('player-connection', playerInd);
    });

    socket.on('player-ready', () => {
        if (connections[playerInd]) {
            connections[playerInd] = false;
        } else {
            socket.broadcast.emit('enemy-ready', playerInd);
            connections[playerInd] = true;
        }
    });

    socket.on('check-players', () => {
        const players = [];
        for (let i in connections) {
            connections[i] == null ? players.push({connected: false, ready: false}) : players.push({connected: true, ready: connections[i]});
        }
        socket.emit('check-players', players);
    });

    socket.on('player-move', move => {
        console.log("Player " + playerInd + " made a move: " + move);
        socket.broadcast.emit('player-move', move);
    });

    socket.on('game-over', result => {
        socket.broadcast.emit('game-over', result);
    });
});