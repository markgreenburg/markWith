/**
 * Database config file. Establishes Mongo connection settings throughout app.
 */
const bluebird = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = bluebird;

/* Define DBs that are avaialable for this app */
<<<<<<< HEAD
const dbUri = {
    test: "mongodb://localhost/markwithtest",
    prod: process.env.MONGODB_URI
};

/* Specify which DB to connect to */
const activeDb = dbUri.test;
=======
const dbUri = process.env.MONGODB_URI || "mongodb://localhost/markwithtest";
>>>>>>> 892c8d8c4f259b79a98afffcaeac04285e9fe81a

// Connect to the specified db
mongoose.connect(dbUri);

// Close connection when app is terminated
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log("Mongoose disconnected from DB due to app shutdown");
        process.exit(0);
    });
});

/* Error logging */
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to: " + dbUri);
});

mongoose.connection.on('error', (err) => {
    console.log("Mongoose connection error!");
    console.log(err);
});

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose disconnected from: " + dbUri);
});

const User = require('./User');
const Doc = require('./Document');

module.exports = {
    User: User,
    Doc: Doc
};
