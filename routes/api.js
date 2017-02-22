'use strict';
const db = require("../models/db");
const uuid = require("uuid/v4");
const config = require("../config");

/**
 * API routes; mounted at /api
 */

const router = require('express').Router();

/* Auth checker */
const checkAuth = (req, res, next) => {
    if (!req.session || !req.signedCookies.authCookie) {
        res.status(401)
            .json({
                "message": "Not authorized",
                "data": {},
                "success": false
            });
    } else if (req.session.userId == req.signedCookies.authCookie.userId
            && req.session.token == req.signedCookies.authCookie.token) {
        next();
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

/* View specific document by id */
router.route('/documents/:id')
    .get()

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
            console.log('got a result');
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