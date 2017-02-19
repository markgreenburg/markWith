'use strict';
// Dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Get new express instance for the app
const app = express();

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

app.listen(3000, () => {
    console.log('listening on *:3000');
});


