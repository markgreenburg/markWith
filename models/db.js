/**
 * Database config file. Establishes Mongo connection settings throughout app.
 */
const bluebird = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = bluebird;

/* Define DBs that are avaialable for this app */
const dbUri = process.env.MONGODB_URI || "mongodb://localhost/markwithtest";

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
