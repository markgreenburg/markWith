'use strict';

/**
 * API routes; mounted at /api
 */
const router = require("express").Router();
const db = require("../models/db");
const uuid = require("uuid/v4");
const config = require("../config");
const Promise = require("bluebird");

/**
 * Document routes
 */
/* View all documents accessible by session user */
router.get('/documents', db.User.apiAuth, (req, res) => {
    db.Doc.getAllDocs(req, (results) => {
        if (results.success) {
            res
                .status(200)
                .send(results);
        } else {
            res
                .status(500)
                .send(results);
        }
    });
});

/* Create new document route, will modifiy/merge just a working version */
router.post('/documents/create', db.User.apiAuth, (req, res) => {
    const newDoc = new db.Doc({
            owners: [req.session.userId], owners_emails: [req.session.email]
    });
    newDoc
        .save()
        .then((result) => {
            res
                .status(200)
                .json({
                    "message": "Document created successfully",
                    "data": result,
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            res
                .status(500)
                .json({
                    "message": "Server error - could not create document",
                    "data": err,
                    "success": false
                });
        });
});

/* Get specific document */
router.get('/documents/:docId', db.User.apiAuth, db.Doc.apiCollab, (req, res) => {
        db.Doc
            .findOne({_id: req.params.docId})
            .then((result) => { // returns empty array if no results
                res
                    .status(200)
                    .json({
                        "message": "Search completed successfully",
                        "data": (result || {}),
                        "success": true
                    });
            }).catch((err) => {
                console.log(err);
                res
                    .status(500)
                    .json({
                        "message": `Server error - could not complete your 
                                request`,
                        "data": err,
                        "success": false
                    });
            });
});

/* Allows updating contents for a given document */
router.post('/documents/update/:docId/contents', 
        db.User.apiAuth, db.Doc.apiCollab, (req, res, next) => {
    if (typeof req.body.contents === 'undefined' 
            || req.body.contents === null) {
        const err = new Error("No contents provided");
        console.log(err);
        res
            .status(500)
            .json({
                "message": "Document update failed",
                "data": err,
                "success": false
            });
        return next(err);
    }
    db.Doc
        .findByIdAndUpdate(req.params.docId,
            { $set: { contents: req.body.contents }}, { new: true })
        .then((updatedDoc) => {
            res
                .status(200)
                .json({
                    "message": "Updated document",
                    "data": updatedDoc,
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            res
                .status(500)
                .json({
                    "message": "Document update failed",
                    "data": err,
                    "success": false
                });
        });

});

/* Allow updating a document's name */
router.post('/documents/update/:docId/name', 
        db.User.apiAuth, db.Doc.apiOwner, (req, res, next) => {
    if (typeof req.body.docName === 'undefined'
            || req.body.docName === null) {
        const err = new Error("No name provided");
        console.log(err);
        res
            .status(500)
            .json({
                "message": "Document update failed",
                "data": err,
                "success": false
            });
        return next(err);
    }
    db.Doc
        .findByIdAndUpdate(req.params.docId,
            { $set: { docName: req.body.docName }}, { new: true })
        .then((updatedDoc) => {
            res
                .status(200)
                .json({
                    "message": "Updated document",
                    "data": updatedDoc,
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            res
                .status(500)
                .json({
                    "message": "Document update failed",
                    "data": err,
                    "success": false
                });
        });
});

/*  Add collaborator to document */
router.post('/documents/update/:docId/add_collab', db.User.apiAuth,
        db.Doc.apiOwner, (req, res, next) => {
    if (typeof req.body.email === 'undefined' || req.body.email === null) {
        const err = new Error("Collaborator name or email not provided");
        console.log(err);
        res
            .status(500)
            .json({
                "message": "Document update failed",
                "data": err,
                "success": false
            });
        return next(err);
    }
    db.User
        .findOne({email: req.body.email})
        .then((newUser) => {
            if (!newUser) {
                return Promise.reject(new Error("User not found"));
            }
            const userId = newUser._id.toString();
            return db.Doc.findByIdAndUpdate(req.params.docId,
                    { $addToSet: {
                        "collabs": userId,
                        "collabs_emails": req.body.email
                    }},
                    { new: true })
        }).then((updatedDoc) => {
            res
                .status(200)
                .json({
                    "message": "Updated document",
                    "data": updatedDoc,
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            res
                .status(500)
                .json({
                    "message": "Document update failed",
                    "data": err,
                    "success": false
                });
        });
});

/*  Remove collaborator from document */
router.post('/documents/update/:docId/remove_collab', 
        db.User.apiAuth, db.Doc.apiSelfCollab, (req, res, next) => {
    if (typeof req.body.email === 'undefined' || req.body.email === null) {
        const err = new Error("No user email");
        console.log(err);
        res
            .status(500)
            .json({
                "message": "Removing collaborator failed",
                "data": err,
                "success": false
            });
        return next(err);
    }
    db.User
        .findOne({email: req.body.email})
        .then((newUser) => {
            if (!newUser) {
                return Promise.reject(new Error("User not found"));
            }
            const userId = newUser._id.toString();
            return db.Doc.findByIdAndUpdate(req.params.docId,
                    { $pullAll: 
                            {"collabs": [userId],
                            "collabs_emails": [req.body.email]}
                    },
                    { new: true })
        }).then((updatedDoc) => {
            res
                .status(200)
                .json({
                    "message": "Updated document",
                    "data": updatedDoc,
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            res
                .status(500)
                .json({
                    "message": "Document update failed",
                    "data": err,
                    "success": false
                });
        });
});

/* Delete an existing document */
router.post('/documents/delete/:docId', 
        db.User.apiAuth, db.Doc.apiOwner, (req, res) => {
    const documentId = req.params.docId;
    db.Doc
        .findByIdAndRemove(documentId)
        .then((removedDoc) => {
            res
                .status(200)
                .json({
                    "message": "Document sucessfully deleted",
                    "data": removedDoc,
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            res
                .status(500)
                .json({
                    "message": "Document remove failed",
                    "data": err,
                    "success": false
                });
        });
});

/**
 * User / account routes
 */

/* Create account for new user */
router.post('/user/register', (req, res) => {
    const newUser = new db.User({
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: req.body.password
    });
    newUser
        .save()
        .then((result) => {
            res
                .status(200)
                .json({
                    "message": "User created",
                    "data": {
                        "id": result._id,
                        "fName": result.fName,
                        "lName": result.lName,
                        "email": result.email,
                        "createdAt": result.createdAt,
                        "lastModified": result.lastModified
                    },
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            res
                .status(200)
                .json({
                    "message": "User creation failed",
                    "data": err,
                    "success": false
                });
        });
});

/* Get user info */
router.get('/user', db.User.apiAuth, (req, res) => {
    db.User
        .findOne({_id: req.session.userId})
        .then((result) => {
            res
                .status(200)
                .json({
                    "message": "Search completed successfully",
                    "data": (result ? result : {}),
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            res
                .status(500)
                .json({
                    "message": "Server error - could not complete your request",
                    "data": err,
                    "success": false
                });
        });
});

/* Update existing user info */
router.post("/user/update", db.User.apiAuth, (req, res) => {
    db.User
        .findOne({_id: req.session.userId})
        .then((userToUpdate) => {
            if (!userToUpdate) {
                return Promise.reject(new Error("Could not find user"));
            }
            if (typeof req.body.fName !== 'undefined' 
                    && req.body.fName !== null && req.body.fName.length) {
                userToUpdate.fName = req.body.fName;
            } if (typeof req.body.lName !== 'undefined' 
                    && req.body.lName !== null && req.body.lName.length) {
                userToUpdate.lName = req.body.lName;
            } if (typeof req.body.email !== 'undefined' 
                    && req.body.email !== null && req.body.email.length) {
                userToUpdate.email = req.body.email;
            } if (typeof req.body.password !== 'undefined' 
                    && req.body.password !== null && req.body.password.length) {
                userToUpdate.password = req.body.password
            }
            return userToUpdate.save()
        }).then((updatedUser) => {
            res
                .status(200)
                .json({
                    "message": "Updated user",
                    "data": {
                        "fName": updatedUser.fName,
                        "lName": updatedUser.lName,
                        "email": updatedUser.email,
                        "createdAt": updatedUser.createdAt,
                        "lastModified": updatedUser.lastModified
                    },
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            res
                .status(500)
                .json({
                    "message": "User update failed",
                    "data": err,
                    "success": false
                });
        });
});

/* Log in existing user */
router.post('/user/login', (req, res) => {
    db.User
        .findOne({ email: req.body.email })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error("User not found"));
            }
            result.comparePassword(req.body.password, (err, match) => {
                if (err) {
                    return Promise.reject(new Error("Could not log in"));
                } else if (match === false) {
                    Promise.reject(new Error("Could not log in"));
                } else if (match === true) {
                    // correct password
                    const token = uuid();
                    const authInfo = {
                        token: token,
                        email: result.email,
                        userId: result._id
                    };
                    // set the session and cookie
                    req.session.token = authInfo.token;
                    req.session.userId = authInfo.userId;
                    req.session.email = authInfo.email;
                    res
                        .status(200)
                        .cookie('authCookie', authInfo, config.cookieOptions)
                        .json({
                            "message": "Login successful",
                            "data": {
                                "token": authInfo.token,
                                "userId": authInfo.userId,
                                "email": authInfo.email
                            },
                            "success": true
                        });
                }
            });
        }).catch((err) => {
            console.log(err);
            res.status(401)
                .json({
                    "message": "Could not log in",
                    "data": {},
                    "success": false
                });
        });
});

/* Log out a user */
router.post('/user/logout', (req, res) => {
    req.session.destroy();
    res
        .status(200)
        .json({
            "message": "User logged out",
            "data": {},
            "success": true
        });
});

/* Delete user account */
router.post('/user/delete', (req, res) => {
    db.User
        .remove({ _id: req.session.userId })
        .then(() => {
            req.session.destroy();
            res
                .status(200)
                .json({
                    "message": "User removed",
                    "data": {},
                    "success": true
                });
        }).catch((err) => {
            console.log(err);
            req
                .status(500)
                .json({
                    "message": "Server error: could not delete user",
                    "data": err,
                    "success": false
                });
        });
});

module.exports = router;
