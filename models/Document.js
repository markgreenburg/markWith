/**
 * Mongoose models and classmethods for interacting with Documents
 */
const notAuthorized = {
    "message": "Not authorized",
    "data": {},
    "success": false
};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Document Schema
const documentSchema = new Schema({
    docName: { type: String, required: true, default: "untitled" },
    owners: { type: Array, required: true },
    owners_emails: { type: Array, required: true },
    collabs: { type: Array, required: false },
    collabs_emails: { type: Array, required: false },
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
    Doc
        .findOne({ $and: [{_id: docId}, {owners: likeUserId}]})
        .then((result) => {
            if (!result) {
                return callback(false);   
            }
            return callback(true);
        }).catch((err) => {
            console.log(err);
            return callback(false);
        });
};

const isCollab = (req, callback) => {
    const docId = req.params.docId || req.body.docId;
    const likeUserId = new RegExp(".*" + req.session.userId + ".*");
    Doc
        .findOne({ $and: [{_id: docId}, {collabs: likeUserId}]})
        .then((result) => {
            if (result) {
                return callback(true);
            }
            return callback(false);
        }).catch((err) => {
            console.log(err);
            return callback(false);
        });
};

/* Checks modifier against document owners, handles API response */
documentSchema.statics.apiOwner = (req, res, next) => {
    isOwner(req, (result) => {
        if (result === true) {
            return next();
        }
        res
            .status(403)
            .json(notAuthorized);
    });
}

/* Elevated 'self' privilege for collaborators, handles API response */
documentSchema.statics.apiSelfCollab = (req, res, next) => {
    isOwner(req, (result) => {
        if (result === true) { return next() }
        if (typeof req.body.email === 'undefined'
                || req.body.email === null
                || typeof req.session.email === 'undefined'
                || req.session.email === null
                || req.body.email !== req.session.email) {
            res
                .status(403)
                .json(notAuthorized);
            return;
        }
        isCollab(req, (result) => {
            if (!result) {
                res
                    .status(403)
                    .json(notAuthorized);
                return;
            }
            return next()
        });
    });
}

/* Checks modifier against document owners, handles API response */
documentSchema.statics.apiCollab = (req, res, next) => {
    isOwner(req, (result) => {
        if (result) {
            return next();
        }
        isCollab(req, (result) => {
            if (!result) {
                res.status(403)
                .json(notAuthorized);
            }
            return next();
        });
    });
}

/* Checks modifier against document owners, handles client response */
documentSchema.statics.clientOwner = (req, res, next) => {
    isOwner(req, (result) => {
        if (result) {
            return next();
        }
        res.redirect("/documents");
    });
}

/* Elevated 'self' privilege for collaborators, handles client response */
documentSchema.statics.clientSelfCollab = (req, res, next) => {
    isOwner(req, (result) => {
        if (result) { return next() }
        if (typeof req.body.email !== 'undefined'
                && req.body.email !== null
                && typeof req.session.email !== 'undefined'
                && req.session.email !== null
                && req.body.email === req.session.email) {
            isCollab(req, (result) => {
                if (result === true) { return next() }
            });
        }
        res.redirect("/documents");
    });
}

/* Checks modifier against document collabs, handles client response */
documentSchema.statics.clientCollab = (req, res, next) => {
    isOwner(req, (result) => {
        if (result) {
            return next();
        }
        isCollab(req, (result) => {
            if (result) {
                return next();
            }
            res.redirect("/documents");
        });
    });
}

/* Gets all documents belonging to the requesting user */
documentSchema.statics.getAllDocs = (req, callback) => {
    if (typeof req.session.userId === 'undefined'
            || req.session.useId === null) {
        const err = new Error("No user information supplied");
        console.log(err);
        const results = {
            "message": "Search failed",
            "data": err,
            "success": false
        };
        return callback(results);
    }
    const likeUserId = new RegExp(".*" + req.session.userId + ".*");
    Doc
        .find({$or: [{owners: likeUserId}, {collabs: likeUserId}]})
        .then((docArray)=> {
            const results = {
                "message": "Search completed sucessfully",
                "data": docArray,
                "success": true
            };
            return callback(results);
        }).catch((err) => {
            console.log(err);
            const results = {
                "message": "Server error",
                "data": err,
                "success": false
            }
            return callback(results);
    });
}

const Doc = mongoose.model('Doc', documentSchema);

module.exports = Doc;
