/**
 * Mongoose models and classmethods for interacting with Documents
 */
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

const Schema = mongoose.Schema;

// Document Schema
const documentSchema = new Schema({
    docName: { type: String, required: true, default: "untitled" },
    owners: { type: Array, required: true },
    owners_emails: { type: Array, required: true },
    collabs: { type: Array, required: false, unique: true },
    collabs_emails: { type: Array, required: false, unique: true },
    contents: { type: String, default: ""},
    history: {
        fDate: { type: Date, required: true, default: Date.now()  },
        tDate: { type: Date, required: true,
                default: new Date().toISOString() },
        contents: { type: String, default: "" }
    },
    createdAt: { type: Date, required: true, default: Date.now },
    lastModified: { type: Date, required: true, default: Date.now }
});

<<<<<<< HEAD
documentSchema.statics.getAllDocs = function (userId, callback) {
    const regularExpression = new RegExp(".*" + userId + ".*");
    this.find({$or: [{owners: regularExpression}, {collabs: regularExpression}]})
        .then((results) => {
            callback(results)
=======
/**
 * Doc permissions checks
 */
const isOwner = (req) => {
    const docId = req.params.docId || req.body.docId;
    const likeUserId = new RegExp(".*" + req.session.userId + ".*");
    Doc.findOne({ $and:[{ "_id": ObjectId(docId)}, {owners: likeUserId}]})
        .then((result) => {
            if (result) {
                true;
            } else {
                return false;
            }
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};

const isCollab = (req) => {
    const docId = req.params.docId || req.body.docId;
    const likeUserId = new RegExp(".*" + req.session.userId + ".*");
    Doc.findOne({ $and:[{ "_id": ObjectId(docId)}, {collabs: likeUserId}]})
        .then((result) => {
            if (result) {
                return true;
            } else {
                return false;
            }
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};

/* Checks modifier against document collabs, handles API response */
documentSchema.statics.apiCollab = (req, res, next) => {
    if (isCollab(req) === true || isOwner(req) === true) {
        next();
    } else {
        res.status(403)
            .json({
                "message": "Not authorized",
                "data": {},
                "success": false
            });
    }
}

/* Checks modifier against document collabs, handles client response */
documentSchema.statics.clientCollab = (req, res, next) => {
    if (isCollab(req) === true || isOwner(req) === true) {
        next();
    } else {
        res.redirect("/user/login");
    }
}

/* Checks modifier against document owners, handles API response */
documentSchema.statics.apiOwner = (req, res, next) => {
    if (isOwner(req) === true) {
        next();
    } else {
        res.status(403)
            .json({
                "message": "Not authorized",
                "data": {},
                "success": false
            });
    }
}

/* Checks modifier against document collabs, handles client response */
documentSchema.statics.clientOwner = (req, res, next) => {
    if (isOwner(req) === true) {
        next();
    } else {
        res.redirect("/user/login");
    }
}

documentSchema.statics.getAllDocs = (callback) => {
    const regularExpression = new RegExp(".*" + req.session.userId + ".*");
    this.find({$or: [{owners: regularExpression}, {collabs: regularExpression}]})
        .then((results)=> {
            res.json({
                "message": "Documents rendered sucessfully",
                "data": results,
                "success": true,
            });
            callback(result);
>>>>>>> 0e813934cccf5fe9bcfa1f56efcbb901e0539b33
        })
        .catch((err) => {
            callback(err)
        });
}

const Doc = mongoose.model('Doc', documentSchema);

module.exports = Doc;
