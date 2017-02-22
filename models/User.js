/**
 * Mongoose models and classmethods for interacting with Users
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new Schema({
    fName: { type: String, required: true },
    lName: {type: String, required: true },
    email: {type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
    lastModified: { type: Date, required: true, default: Date.now }
    });

// Define bcrypt middleware for hashing passwords
userSchema.pre('save', (next) => {
    const user = this;
    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
    });
});

userSchema.methods.comparePassword = (typedPassword, callback) => {
        bcrypt.compare(typedPassword, this.password, (err, match) => {
            if (err) {
                return callback(err);
            }
            callback(null, match);
        });
}

const createUser = (req, res, next) => {
    let newUser = new User();
    newUser.fName = req.body.fName;
    newUser.lName = req.body.lName;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.createdAt = new Date();
    newUser.lastUpdated = newUser.createdAt;
};


module.exports = mongoose.model('User', userSchema);
