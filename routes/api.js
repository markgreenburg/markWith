/**
 * API routes; mounted at /api
 */
'use strict';

const db = require("../models/db");
const uuid = require("uuid/v4");
const config = require("../config");
const router = require('express').Router();

/* Auth checker */
const checkAuth = (req, res, next) => {
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

/**
 * Document routes
 */
/* View all documents accessible by session user */
router.get('/documents', checkAuth, (req, res) => {
    const regularExpression = new RegExp("/" + req.session.email + "/");
    db.Doc.find( {$or: [{owners: regularExpression}, 
            {collabs: regularExpression}]})
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

/* Putting get documents route in api for documents, may revisit */
// router.get('/documents', (req, res, next) => {
//     res.render('docs_dashboard', {myDocuments: myDocuments});
// });

/* Create new document route, will modifiy/merge just a working version */
router.post('/documents/create', (req, res) => {
    let newDoc = new db.Doc();
    newDoc.save(function(err) {
        if (err)
            throw err;
        else
            console.log(res);
    });
});

/* View all and create new documents - tied to user */
router.route('/documents/:userId')
    .get()
    .post();

/* New Document get route, again will revisit */
router.get('/documents/create', (req, res) => {
    res.render('doc_template', {session: req.session});
});

/* Also putting get route in api with post, may revisit */
// router.get('/documents/:id', (req, res) => {
//     res.render('doc_screen', { session: req.session, myDoc: myDoc });
// })

/* Also putting get document id route in api with post, may revisit */
router.post('/documents/:id', (req, res) => {
    var documentId = req.params.id;
    db.Doc.findOne({_id: documentId}).exec(function(myDoc) {
        if (myDoc) {
            res.json(myDoc);
        }
        else {
            res.json({
                message: "This document does not exist."
            })
        }
    });
});

/**
 * Account routes
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

/* Update existing user info */
router.post("/user/update", checkAuth, (req, res) => {
    db.User.findOne({_id: req.session.userId})
        .then((userToUpdate) => {
            if (userToUpdate) {
                if (req.body.fName) {
                    userToUpdate.fName = req.body.fName;
                } if (req.body.lName) {
                    userToUpdate.lName = req.body.lName;
                } if (req.body.email) {
                    userToUpdate.email = req.body.email;
                } if (req.body.password) {
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

/* To-Do: */
/* Update User (incl. password) */
/* - What method to use, ensure rehashing happens only if necessary */
/* Log Out */
/* Delete User */

module.exports = router;
