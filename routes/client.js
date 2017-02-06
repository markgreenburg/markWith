'use strict';
const router = require('express').Router();

// Home Page
router.get('/', (req, res) => {
    res.render('index');
});



module.exports = router;