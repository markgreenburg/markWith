/**
 * Database config file. Establishes Mongo connection settings throughout app.
 */
const bluebird = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = bluebird;

/* Define DBs that are avaialable for this app */
const dbUri = {
    test: "mongodb://localhost/markwithtest",
    prod: ""
};

/* Specify which DB to connect to */
const activeDb = dbUri.test;

// Connect to the specified db
mongoose.connect(activeDb);

// Close connection when app is terminated
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log("Mongoose disconnected from DB due to app shutdown");
        process.exit(0);
    });
});

/* Error logging */
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to: " + activeDb);
});

mongoose.connection.on('error', (err) => {
    console.log("Mongoose connection error!");
    console.log(err);
});

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose disconnected from: " + activeDb);
});

const User = require('./User');
const Doc = require('./Document');

module.exports = {
    User: User,
    Doc: Doc
};
