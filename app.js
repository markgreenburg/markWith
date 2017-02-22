'use strict';
// Dependencies & server setup
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http').Server(app);
const db = require('./models/db');
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;

const config = require('./config');
const session = require('express-session');
const sess = {
    secret: config.sessionSecret,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24 hours
};

// Test socket.io collab implementation with a global
let text = "";

// Load routers
const client = require('./routes/client');
const api = require('./routes/api');

// Set view directory and view engine to handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Ensure session and cookie parser are both using same secret
app.use(cookieParser(config.sessionSecret));
app.use(session(sess));

// Set static path to public
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
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
    socket.on("text changed", (data) => {
        // Copy the changes to server
        text = data.newText;
        // Emit server's version and insertion index back to everyone else
        socket.broadcast.emit("text changed", {
            newText: text,
            cursor: data.cursor
        });
    });
});

http.listen(port, () => {
    console.log('listening on *:3000');
});
