'use strict';
// Dependencies & server setup
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
// const mongoose = require('mongoose');
// Test socket.io collab implementation with a global
let text = "";

// Load routers
const client = require('./routes/client');
const api = require('./routes/api');

// Set view directory and view engine to handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Set static path to public
app.use(express.static(path.join(__dirname, 'public')));

// Mount router middleware
app.use('/', client);
app.use('/api', api);

// When user connects to socket
io.on("connection", (socket) => {
    // Pre-populate client's editor with most recent text
    if (io.sockets.connected[socket.id]) {
        io.sockets.connected[socket.id].emit("populate editor", text);
    }
    // When new text changes received, broadcast new text to all sockets except 
    // originator
    socket.on("text changed", (newText) => {
        // Copy the changes to server
        text = newText;
        // Emit server's version back to everyone else
        socket.broadcast.emit("text changed", text);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});


