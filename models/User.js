/**
 * Mongoose models and classmethods for interacting with Users
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

<<<<<<< HEAD
// User Schema
=======
const Schema = mongoose.Schema;

>>>>>>> origin/master
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

<<<<<<< HEAD
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
=======
userSchema.statics.checkAuth = function (req, res, next, callback) {
    console.log(req.cookies.authCookie);
    const cookie = req.cookies.authCookie;
    const session = req.session;
    if (session.userId == cookie.userId && session.token == cookie.token) {
        next();
    } else {
        res.status(401)
        callback()
    }
}
const User = mongoose.model('User', userSchema);

module.exports = User;
>>>>>>> origin/master
