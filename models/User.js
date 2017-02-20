/**
 * Mongoose models and classmethods for interacting with Users
 */
//
// module.exports = {
//     User: User,
//     otherStuff: "etc..."
// };

module.exports = function User (fName, lName, profilePic, email, password, createdAt, lastLogin) {
    this.fName = fName;
    this.lName = lName;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
    this.test = function() {
        console.log(this.fName + ' ' + this.email + ' ' + this.lastLogin);
    };
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    fName: { type: String, required: true },
    lName: {type: String, required: true },
    email: {type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
    lastLogin: { type: Date, required: true, default: Date.now }
    });

const User = mongoose.model('User', userSchema);
