'use strict';

/**
 * API routes; mounted at /api
 */
const db = require("../models/db");
const uuid = require("uuid/v4");
const config = require("../config");
const router = require('express').Router();

/**
 * Document routes
 */
/* View all documents accessible by session user */
router.post('/documents', db.User.checkAuth, (req, res) => {
    const regularExpression = new RegExp(".*" + req.session.email + ".*");
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

/* Create new document route, will modifiy/merge just a working version */
// router.post('/documents/create', checkAuth, (req, res) => {
//     let email = req.session.email;
//     let newDoc = new db.Doc({owners: email});

// router.post('/documents/create', (req, res) => {
//     let newDoc = new db.Doc();
//     newDoc.save(function(err) {
//         if (err)
//             throw err;
//         else
//             console.log(res);
//     });
// });

router.post('/documents/create', db.User.checkAuth, (req, res) => {
    let email = req.session.email;
    let newDoc = new db.Doc({owners: email});
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
// <<<<<<< HEAD
// router.get('/documents/create', checkAuth, (req, res) => {
// =======
// router.get('/documents/create', (req, res) => {
// >>>>>>> 8f688e399b49181724d8a05d4a82a5af7fdfc36e
//     res.render('doc_template', {session: req.session});
// });

// /* Also putting get route in api with post, may revisit */
// <<<<<<< HEAD
// router.get('/documents/:id', checkAuth, (req, res) => {
//     res.render('doc_screen', { session: req.session });
// })

// /* Also putting get document id route in api with post, may revisit */
// router.post('/documents/:id', checkAuth, (req, res) => {
// =======
// router.get('/documents/:id', (req, res) => {
//     res.render('doc_screen', { session: req.session, myDoc: myDoc });
// })

/* Also putting get document id route in api with post, may revisit */
// router.post('/documents/:id', (req, res) => {
// >>>>>>> 8f688e399b49181724d8a05d4a82a5af7fdfc36e
//     var documentId = req.params.id;
//     db.Doc.findOne({_id: documentId})
//     .then((results) => { // returns empty array if no results
//             res.status(200)
//                 .json({
//                     "message": "Document search succeeded",
//                     "data": results,
//                     "success": true
//                 });
//     })
//     .catch((err) => {
//         console.log(err);
//         res.status(500)
//             .json({
//                 "message": "Server error - could not complete your request",
//                 "data": err,
//                 "success": false
//             });
//     });
// });


/* Individual document post */
router.post('/documents/:id', (req, res) => {
    var documentId = req.params.id;
    db.Doc.findOne({_id: documentId})
    .then((result) => { // returns empty array if no results
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
router.get('/user', db.User.checkAuth, (req, res) => {
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
router.post("/user/update", db.User.checkAuth, (req, res) => {
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

/* To-Do: */

module.exports = router;
