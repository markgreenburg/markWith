/**
 * Mongoose models and classmethods for interacting with Users
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fName: { type: String, required: true },
    lName: {type: String, required: true },
    email: {type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    lastModified: { type: Date, required: true, default: Date.now }
    });

// Define bcrypt middleware for hashing passwords
userSchema.pre('save', function (next) {
    const self = this;
    const saltRounds = 10;
    bcrypt.hash(self.password, saltRounds, function (err, hash) {
        if (err) {
            return next(err);
        }
        self.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function (typedPassword, callback) {
        bcrypt.compare(typedPassword, this.password, (err, match) => {
            if (err) {
                return callback(err);
            }
            callback(null, match);
        });
}

const User = mongoose.model('User', userSchema);

module.exports = User;
