'use strict';
// Dependencies & server setup
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const db = require("./models/db");
const port = process.env.PORT || 3000;

const config = require('./config');
const session = require('express-session');
const sess = {
    secret: config.sessionSecret,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24 hours
};

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

/**
 * Socket Server
 */

// When user connects to socket
io.on("connection", (socket) => {
    // Let client join room represented by doc ID
    socket.on("room", (room) => {
        socket.join(room, () => {
            // Send new connection the current doc content
            db.Doc.findOne({_id: room})
                .then((result) => {
                    let text = {};
                    if (result) {
                        text = result;
                    } else {
                        // To-Do: Create new doc if one doesn't exist?
                        text = {
                            docName: "",
                            owners: [],
                            collaborators: [],
                            contents: "Sorry, document not found"
                        };
                    }
                    socket.emit("populate editor", text);
                })
                .catch((err) => {
                    console.log(err);
                    const text = {
                        docName: "",
                        owners: [],
                        collaborators: [],
                        contents: err
                    };
                    socket.emit("populate editor", text);
                });
        });
    });

    // When new text changes received, broadcast new text to all sockets except
    // originator
    socket.on("text changed", (data) => {
        const room = data.docId;
        // Copy the changes to db
        // To-Do: Write old content to history?
        db.Doc.findByIdAndUpdate(data.docId, 
                { $set: { contents: data.newText}},
                { new: true })
            // send updated doc back to other sockets in same room
            .then((newDocument) => {
                socket.to(room).broadcast.emit("text changed", {
                    newText: newDocument.contents,
                    cursor: data.cursor
                });
            })
            .catch((err) => {
                socket.to(room).broadcast.emit("text changed", {
                    newText: "Warning - last change not saved. Please reload" 
                            + "your browser. Err: " + err,
                    cursor: data.cursor
                });
            });
    });
});

http.listen(port, () => {
    console.log('listening on *:3000');
});
