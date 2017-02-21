'use strict';

/**
 * Client-side routes; mounted at / (root)
 */
const router = require('express').Router();

// Home Page
router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/user/signup', (req, res, next) => {

});

router.get('/user/login', (req, res, next) => {

});

router.get('/user/documents', (req, res, next) =>{

});

router.get('/user/profile', (req, res, next) => {

});

router.get('/documents/:id', (req, res, next) => {

});



// View a document
// router.get('/documents/:id', (req, res, next) => {
//     // take user to namespace with their doc
//     // add auth to middleware
// });

module.exports = router;
