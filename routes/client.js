'use strict';

/**
 * Client-side routes; mounted at / (root)
 */
const router = require('express').Router();

// Home Page
router.get('/', (req, res, next) => {
    res.render('index');
});
// Sign up page
router.get('/user/signup', (req, res, next) => {
    res.render('signup');
});
// Login page
router.get('/user/login', (req, res, next) => {
    res.render('login');
});
// Documents main page
router.get('/user/documents', (req, res, next) =>{
    res.render('dashboard')
});
// Profile edit page
router.get('/user/profile', (req, res, next) => {
    res.render('profile')
});
// Document/Editing page 
router.get('/documents/:id', (req, res, next) => {
    res.render('docscreen')
});



// View a document
// router.get('/documents/:id', (req, res, next) => {
//     // take user to namespace with their doc
//     // add auth to middleware
// });

module.exports = router;
