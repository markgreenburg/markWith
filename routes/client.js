'use strict';

/**
 * Client-side routes; mounted at / (root)
 */
const router = require('express').Router();

/* Home Page */
router.get('/', (req, res, next) => {
    res.render('index');
});
// Registration page
router.get('/user/register', (req, res, next) => {
    if (req.session.token) {
      res.redirect('/user/documents');
  } else {
      res.render('signup', {session: req.session});
  }
});

/* Login page */
router.get('/user/login', (req, res, next) => {
    if (req.session.token) {
        res.redirect('/users/documents');
    } else {
        res.render('login', {session: req.session});
});

// Serve all user documents main page
// router.get('/user/documents/', (req, res, next) =>{
//         res.render('documents', { session: req.session, myDocs: myDocs });
// });
/* Profile edit page */
router.get('/user/profile', (req, res, next) => {
    res.render('profile', { session: req.session });
});
/* Document/Editing page */
router.get('/documents/:id', (req, res, next) => {
    res.render('doc_screen', { session: req.session, myDoc: myDoc });
});



// View a document
// router.get('/documents/:id', (req, res, next) => {
//     // take user to namespace with their doc
//     // add auth to middleware
// });

module.exports = router;
