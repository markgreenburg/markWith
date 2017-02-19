'use strict';

/**
 * API routes; mounted at /api
 */

const router = require('express').Router();

/* View all and create new documents */
router.route('/documents')
    .get()
    .post();

/* View specific document by id */
router.route('/documents/:id')
    .get()


/* Create account for new user */
router.post('/user/register', (req, res) => {
    // Create an account and respond
});

/* Log in existing user */
router.post('/user/login', (req, res) => {
    // Log user in and respond
});

module.exports = router;