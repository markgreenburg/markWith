'use strict';

/**
 * Client-side routes; mounted at / (root)
 */
const router = require('express').Router();
const db = require("../models/db");

/* Home Page */
router.get('/', (req, res) => {
    res.render('home');
});

/* Registration page */
router.get('/user/register', (req, res) => {
    res.render('register');
  });

/* Login page */
router.get('/user/login', (req, res) => {
    res.render('login');
});

/* Account Profile */
router.get('/user/account', db.User.checkAuth, (req, res) => {
    res.render('account');
});

/* Documents store */
router.get('/documents', db.User.checkAuth, (req, res) => {
    res.render('documents');
});

// router.get('/user/documents/', (req, res, next) =>{
//         res.render('documents', { session: req.session, myDocs: myDocs });
// });
/* Profile edit page */

router.get('/user/profile', (req, res) => {
    res.render('profile', { session: req.session });
});
/* Document/Editing page */
// router.get('/documents/:id', (req, res) => {
//     res.render('doc_screen', { session: req.session, myDoc: myDoc });
// });

// View a document
// router.get('/documents/:id', (req, res, next) => {
//     // take user to namespace with their doc
//     // add auth to middleware
// });

module.exports = router;
