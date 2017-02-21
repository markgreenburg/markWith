'use strict';

/**
 * Client-side routes; mounted at / (root)
 */
const router = require('express').Router();

// Home Page
router.get('/', (req, res, next) => {
    res.render('index');
});

// View a document
// router.get('/documents/:id', (req, res, next) => {
//     // take user to namespace with their doc
//     // add auth to middleware
// });

module.exports = router;