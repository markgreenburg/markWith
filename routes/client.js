'use strict';

/**
 * Client-side routes; mounted at / (root)
 */
const router = require('express').Router();

// Home Page
router.get('/', (req, res) => {
    res.render('index');
});


module.exports = router;