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
    createdAt: { type: Date, required: true, default: Date.now() },
    lastModified: { type: Date, required: true, default: Date.now() }
});

// Define bcrypt middleware for hashing new and changed passwords
userSchema.pre('save', function (next) {
    const self = this;
    if (!self.isModified('password')) {
        next();
    } else {
        const saltRounds = 10;
        bcrypt.hash(self.password, saltRounds, function (err, hash) {
            if (err) {
                next(err);
            } else {
                self.password = hash;
                next();
            }
        });
    }
});

// Define middleware for updating lastUpdated timestamps
userSchema.pre('save', function (next) {
    const self = this;
    self.lastModified = Date.now();
    next();
});

userSchema.methods.comparePassword = function (typedPassword, callback) {
        bcrypt.compare(typedPassword, this.password, (err, match) => {
            if (err) {
                return callback(err);
            }
            callback(null, match);
        });
}

userSchema.statics.checkAuth = (req, res, next, callback) => {
    const cookie = (req.signedCookies.authCookie ?
            req.signedCookies.authCookie : {});
    const session = (req.session ? req.session : {});
    const sessionUserId = (session.userId ? session.userId : null);
    const sessionToken = (session.token ? session.token : null);
    const cookieUserId = (cookie.userId ? cookie.userId : null);
    const cookieToken = (cookie.token ? cookie.token : null);
    if (sessionUserId && sessionToken && cookieUserId && cookieToken) {
        if (sessionUserId === cookieUserId && sessionToken === cookieToken) {
            return next();
        }
    }
    res.status(401)
        .json({
            "message": "Not authorized",
            "data": {},
            "success": false
        });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
