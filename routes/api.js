'use strict';

/**
 * API routes; mounted at /api
 */
const router = require('express').Router();
const db = require("../models/db");
const uuid = require("uuid/v4");
const config = require("../config");

/**
 * Document routes
 */
/* View all documents accessible by session user */
router.post('/documents', db.User.apiAuth, (req, res) => {
    const regularExpression = new RegExp(".*" + req.session.userId + ".*");
    db.Doc.find( {$or: [{owners: regularExpression}, {collabs: regularExpression}]})
        .then((results) => { // returns empty array if no results
                res.status(200)
                    .json({
                        "message": "Document search succeeded",
                        "data": results,
                        "success": true
                    });
        })
        .catch((err) => {
            console.log(err);
            res.status(500)
                .json({
                    "message": "Server error - could not complete your request",
                    "data": err,
                    "success": false
                });
        });
});

/* Documents get all route */
router.get('/documents/getAll', db.User.apiAuth, (req, res) => {
const regularExpression = new RegExp(".*" + req.session.userId + ".*");
db.Doc.find({$or: [{owners: regularExpression}, {collabs: regularExpression}]})
    .then((docs)=> {
        res.json({
            "message": "Documents rendered sucessfully",
            "data": docs,
            "success": true
        });
    });
});


/* Create new document route, will modifiy/merge just a working version */
router.post('/documents/create', db.User.apiAuth, (req, res) => {
    const newDoc = new db.Doc({owners: [req.session.userId], owners_emails: [req.session.email]});
    newDoc.save()
        .then((result) => {
            res.status(200)
                .json({
                    "message": "Document created successfully",
                    "data": result,
                    "success": true
                });
        })
        .catch((err) => {
            res.status(500)
                .json({
                    "message": "Server error - could not create document",
                    "data": err,
                    "success": false
                });
        });
});

/* Get specific document */
router.get('/documents/:id', db.User.apiAuth, db.Doc.apiCollab, (req, res) => {
        db.Doc.findOne({_id: req.params.id})
            .then((result) => { // returns empty array if no results
                res.status(200)
                    .json({
                        "message": "Search completed successfully",
                        "data": (result || {}),
                        "success": true
                    });
            })
            .catch((err) => {
                console.log(err);
                res.status(500)
                    .json({
                        "message": "Server error - could not complete your" +           "request",
                        "data": err,
                        "success": false
                    });
            });
});

/* Update Route for Document includes everything except adding and removing collaborators */
router.post('/documents/update/:id', db.User.apiAuth, db.Doc.apiCollab,
        (req, res) => {
    if (isCollab) {
    db.Doc.findOne({_id: req.params.id})
        .then((docToUpdate) => {
            if (docToUpdate) {
                if (req.body.contents) {
                    docToUpdate.contents = req.body.contents;
                }

                docToUpdate.save()
                    .then((updatedDoc) => {
                        res.status(200)
                            .json({
                                "message": "Updated document",
                                "data": {
                                    "contents": updatedDoc.contents,
                                    "lastModified": updatedDoc.lastModified
                                },
                                "success": true
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500)
                            .json({
                                "message": "Server error - document update failed",
                                "data": err,
                                "success": false
                            });
                    });
            } else {
                res.status(200)
                    .json({
                        "message": "Could not find document",
                        "data": {},
                        "success": false
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500)
                .json({

                    "message": "Server error - document update failed",
                    "message": "Server error - could not complete your request",
                    "data": err,
                    "success": false
                });
        });
    }

    else if (isOwner) {
        db.Doc.findOne({_id: documentId})
            .then((docToUpdate) => {
                if (docToUpdate) {
                    if (req.body.docName) {
                        docToUpdate.docName = req.body.docName;
                    }
                    if (req.body.contents) {
                        docToUpdate.contents = req.body.contents;
                    }

                    docToUpdate.save()
                        .then((updatedDoc) => {
                            res.status(200)
                                .json({
                                    "message": "Updated user",
                                    "data": {
                                        "docName": updatedDoc.docName,
                                        "contents": updatedDoc.contents,
                                        "lastModified": updatedDoc.lastModified
                                    },
                                    "success": true
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500)
                                .json({
                                    "message": "Server error - document update failed",
                                    "data": err,
                                    "success": false
                                });
                        });
                } else {
                    res.status(200)
                        .json({
                            "message": "Could not find document",
                            "data": {},
                            "success": false
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500)
                    .json({
                        "message": "Server error - document update failed",
                        "data": err,
                        "success": false
                    });
            });


    }
});

/*  Add collaborator route */
router.post('/documents/update/:id/add_collab', db.User.apiAuth, docAuth, (req, res) => {
    var documentId = req.params.id;
    if (isOwner) {
    db.User.findOne({email: req.body.email}).exec(function(err,user){
        var collab_id = user._id.toString();
        console.log(collab_id);
        db.Doc.findOne({_id: documentId})
            .then((docToUpdate) => {
                if (docToUpdate) {
                        docToUpdate.collabs.push(collab_id);
                        docToUpdate.collabs_emails.push(req.body.email);
                        docToUpdate.save()
                        .then((updatedDoc) => {
                            res.status(200)
                                .json({
                                    "message": "Updated document",
                                    "data": {
                                        "collabs": updatedDoc.collabs,
                                        "lastModified": updatedDoc.lastModified
                                    },
                                    "success": true
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500)
                                .json({
                                    "message": "Server error - document update failed",
                                    "data": err,
                                    "success": false
                                });
                        });
                }


})
});
}
});

/*  Add collaborator route */
router.post('/documents/update/:id/remove_collab', db.User.apiAuth, docAuth, (req, res) => {
    var documentId = req.params.id;
    db.User.findOne({email: req.body.email}).exec(function(err,user){
        console.log(user)
        var collab_id = user._id.toString();
        db.Doc.findOne({_id: documentId})
            .then((docToUpdate) => {
                if (docToUpdate) {
                    console.log(collab_id);
                    console.log(typeof collab_id);
                    if (isOwner) {
                        const index = docToUpdate.collabs.indexOf(collab_id);
                        docToUpdate.collabs.splice(index,1);
                    }
                    if (isCollab) {
                        const index = docToUpdate.collabs.indexOf(collab_id);
                        docToUpdate.collabs.splice(index,1);
                    }
                        docToUpdate.save()
                        .then((updatedDoc) => {
                            res.status(200)
                                .json({
                                    "message": "Updated document",
                                    "data": {
                                        "collabs": updatedDoc.collabs,
                                        "lastModified": updatedDoc.lastModified
                                    },
                                    "success": true
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500)
                                .json({
                                    "message": "Server error - document update failed",
                                    "data": err,
                                    "success": false
                                });
                        });
                }


})
});
});

router.post('/documents/remove/:id', db.User.apiAuth, docAuth, (req, res) => {
    var documentId = req.params.id;
    if (isOwner) {
        db.Doc.findOne({_id: documentId}).remove().exec()
                res.json({
                        "message": "Document sucessfully deleted",
                        "success": true
    });
}
    else {
        res.json({
            "message": "Sorry, you are not authorized to delete this file",
            "success": false
        })
    }

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
    newUser.save()
        .then((result) => {
            res.json({
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
        })
        .catch((err) => {
            console.log(err);
            res.json({
                "message": "User creation failed",
                "data": err,
                "success": false
            });
        });
});

/* Get user info */
router.get('/user', db.User.apiAuth, (req, res) => {
    db.User.findOne({_id: req.session.userId})
        .then((result) => {
            res.status(200)
                .json({
                    "message": "Search completed successfully",
                    "data": (result ? result : {}),
                    "success": true
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500)
                .json({
                    "message": "Server error - could not complete your request",
                    "data": err,
                    "success": false
                });
        });
});

/* Update existing user info */
router.post("/user/update", db.User.apiAuth, (req, res) => {
    db.User.findOne({_id: req.session.userId})
        .then((userToUpdate) => {
            if (userToUpdate) {
                if (req.body.fName
                        && req.body.fName != userToUpdate.fName
                        && req.body.fName.length > 0) {
                    userToUpdate.fName = req.body.fName;
                } if (req.body.lName
                        && req.body.lName != userToUpdate.lName
                        && req.body.lName.length > 0) {
                    userToUpdate.lName = req.body.lName;
                } if (req.body.email
                        && req.body.email != userToUpdate.email
                        && req.body.email.length >= 5) {
                    userToUpdate.email = req.body.email;
                } if (req.body.password
                        && req.body.email.length >= 6) {
                    userToUpdate.password = req.body.password
                }
                userToUpdate.save()
                    .then((updatedUser) => {
                        res.status(200)
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
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500)
                            .json({
                                "message": "Server error - user update failed",
                                "data": err,
                                "success": false
                            });
                    });
            } else {
                res.status(200)
                    .json({
                        "message": "Could not find user",
                        "data": {},
                        "success": false
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500)
                .json({
                    "message": "Server error - user update failed",
                    "data": err,
                    "success": false
                });
        });
});

/* Log in existing user */
router.post('/user/login', (req, res) => {
    db.User.findOne({ email: req.body.email })
        // Found matching user
        .then((result) => {
            result.comparePassword(req.body.password, (err, match) => {
                if (err) {
                    // something went wrong with bcrypt
                    res.status(401)
                        .json({
                            "message": "Could not log in",
                            "data": {},
                            "success": false
                        });
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
                    res.cookie('authCookie', authInfo, config.cookieOptions);
                    // send response
                    res.status(200)
                        .json({
                            "message": "Login successful",
                            "data": {
                                "token": authInfo.token,
                                "userId": authInfo.userId,
                                "email": authInfo.email
                            },
                            "success": true
                        });
                } else if (match === false) {
                    // wrong password
                    res.status(401)
                        .json({
                            "message": "Could not log in",
                            "data": {},
                            "success": false
                        });
                }
            });
        })
        // User doesn't exist or something went wrong with DB
        .catch((err) => {
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
    res.status(200)
        .json({
            "message": "User logged out",
            "data": {},
            "success": true
        });
});

router.post('/user/delete', (req, res) => {
    db.User.remove({ _id: req.session.userId })
        .then(() => {
            req.session.destroy();
            res.status(200)
                .json({
                    "message": "User removed",
                    "data": {},
                    "success": true
                });
        })
        .catch((err) => {
            console.log(err);
            req.statusCode(500)
                .json({
                    "message": "Server error: could not delete user",
                    "data": err,
                    "success": false
                });
        });
});

module.exports = router;
