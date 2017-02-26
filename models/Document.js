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

/**
 * Doc permissions checks
 */
const isOwner = (req, callback) => {
    const docId = req.params.docId || req.body.docId;
    const likeUserId = new RegExp(".*" + req.session.userId + ".*");
    Doc.findOne({ $and: [{_id: docId}, {owners: likeUserId}]})
        .then((result) => {
            if (result) {
                callback(true);
            } else {
                callback(false);
            }
        })
        .catch((err) => {
            console.log(err);
            callback(false);
        });
};

const isCollab = (req, callback) => {
    const docId = req.params.docId || req.body.docId;
    const likeUserId = new RegExp(".*" + req.session.userId + ".*");
    Doc.findOne({ $and: [{_id: docId}, {collabs: likeUserId}]})
        .then((result) => {
            if (result) {
                callback(true);
            } else {
                callback(false);
            }
        })
        .catch((err) => {
            console.log(err);
            callback(false);
        });
};

/* Checks modifier against document owners, handles API response */
documentSchema.statics.apiOwner = (req, res, next) => {
    isOwner(req, (result) => {
        if (result === true) {
            next();
        } else {
            res.status(403)
                .json({
                    "message": "Not authorized",
                    "data": {},
                    "success": false
                });
        }
    });
}

/* Elevated 'self' privilege for collaborators, handles API response */
documentSchema.statics.apiSelfCollab = (req, res, next) => {
    isOwner(req, (result) => {
        if (result === true) {
            next();
        } else {
            if (req.body.email && req.session.email && 
                    req.body.email === req.session.email) {
                isCollab(req, (result) => {
                    if (result === true) {
                        next();
                    }
                });
            } else {
                res.status(403)
                    .json({
                        "message": "Not authorized",
                        "data": {},
                        "success": false
                    });
            }
        }
    });
}

/* Checks modifier against document owners, handles API response */
documentSchema.statics.apiCollab = (req, res, next) => {
    isOwner(req, (result) => {
        if (result === true) {
            return next();
        } else {
            isCollab(req, (result) => {
                if (result === true) {
                    return next();
                } else {
                    res.status(403)
                    .json({
                        "message": "Not authorized",
                        "data": {},
                        "success": false
                    });
                }
            });
        }
    });
}

/* Checks modifier against document owners, handles client response */
documentSchema.statics.clientOwner = (req, res, next) => {
    isOwner(req, (result) => {
        if (result === true) {
            next();
        } else {
            res.redirect("/documents");
        }
    });
}

/* Elevated 'self' privilege for collaborators, handles client response */
documentSchema.statics.clientSelfCollab = (req, res, next) => {
    isOwner(req, (result) => {
        if (result === true) {
            next();
        } else {
            if (req.body.email && req.session.email && 
                    req.body.email === req.session.email) {
                isCollab(req, (result) => {
                    if (result === true) {
                        next();
                    }
                });
            } else {
                res.redirect("/documents");
            }
        }
    });
}

/* Checks modifier against document collabs, handles client response */
documentSchema.statics.clientCollab = (req, res, next) => {
    isOwner(req, (result) => {
        if (result === true) {
            return next();
        } else {
            isCollab(req, (result) => {
                if (result === true) {
                    return next();
                } else {
                    res.redirect("/documents");
                }
            });
        }
    });
}

/* Gets all documents belonging to the requesting user */
documentSchema.statics.getAllDocs = (req, callback) => {
    if (!req.session.userId) {
        const err = new Error("No user information supplied");
        console.log(err);
        const results = {
            "message": "Search failed",
            "data": err,
            "success": false
        };
        callback(results);
    } else {
        const regularExpression = new RegExp(".*" + req.session.userId + ".*");
        Doc.find({$or: [{owners: regularExpression}, {collabs: regularExpression}]})
            .then((docArray)=> {
                const results = {
                    "message": "Search completed sucessfully",
                    "data": docArray,
                    "success": true
                };
                callback(results);
            })
            .catch((err) => {
                console.log(err);
                const results = {
                    "message": "Server error",
                    "data": err,
                    "success": false
                }
                callback(results);
        });
    }
}

const Doc = mongoose.model('Doc', documentSchema);

module.exports = Doc;
