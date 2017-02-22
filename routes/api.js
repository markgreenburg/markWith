'use strict';
<<<<<<< HEAD
const config = require("../models/Config");
const User = require("../models/User");
const Document = require("../models/Document");
=======
const db = require("../models/db");
const uuid = require("uuid/v4");
const config = require("../config");
>>>>>>> origin/master

/**
 * API routes; mounted at /api
 */

const router = require('express').Router();

<<<<<<< HEAD
/* View all and create new documents */
router.post('/documents', (req, res, next) {
    mongoose.connect(Config.mongoConfig.db);
    var regularExpression = new RegExp("/" + req.session.email + "/");
    Doc.find( {$or: [{owners: regularExpression}, {collabs: regularExpression}]}).exec(function(myDocs){
        if (myDocs) {
        console.log(myDocs);
        var myDocuments = [];
        for (var i = 0; i < myDocs.length; i++) {
            myDocuments.push(myDocs[i]);
        }
    res.json(myDocuments);
    }
    else {
        res.json({
            message: "You have no current documents."
        })
    }
    });
});

/* Putting get documents route in api for documents, may revisit */
router.get('/documents', (req, res, next) {
    res.render('docs_dashboard', {myDocuments: myDocuments});
});

/* Create new document route, will modifiy/merge just a working version */
router.post('/documents/create', (req, res, next) {
    mongoose.connect(Config.mongoConfig.db);
    let newDoc = new Doc();
    newDoc.save(function(err) {
        if (err)
            throw err;
        else
            console.log('new document created successfully...');
    });
});
=======
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
        if (sessionUserId == cookieUserId && sessionToken == cookieToken) {
        next();
        }
    }
    res.status(401)
        .json({
        "message": "Not authorized",
        "data": {},
        "success": false
    });
};

/* Test Route - tests checkAuth */
router.post('/test', checkAuth, (req, res) => {
    res.json({
        "message": "authorized",
        "data": {
            "sessionUserId": req.session.userId,
            "sessionEmail": req.session.email,
            "sessionToken": req.session.token,
            "cookie": req.signedCookies.authCookie
        },
        "success": true
    });
});

/* View all and create new documents - tied to user */
router.route('/documents/:userId')
    .get()
    .post();
>>>>>>> origin/master

/* New Document get route, again will revisit */
router.get('/documents/create', (req, res, next) {
    res.render('doc_template', session: req.session);
});

/* Also putting get route in api with post, may revisit */
router.get('/documents/:id', (req, res, next) {
    res.render('doc_screen', { session: req.session, myDoc: myDoc });
})

/* Also putting get document id route in api with post, may revisit */
router.post('/documents/:id', (req, res, next) => {
    mongoose.connect(Config.mongoConfig.db);
    var documentId = req.params.id;
    Doc.findOne({_id: documentId}).exec(function(myDoc) {
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
                } else if (match == true) {
                    // correct password
                    const token = uuid();
                    const authInfo = {
                        token: token,
                        email: result.email,
                        userId: result._id
                    };
                    // set the session
                    req.session.token = authInfo.token;
                    req.session.userId = authInfo.userId;
                    req.session.email = authInfo.email;
                    // set the cookie
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
                } else if (match == false) {
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

module.exports = router;
