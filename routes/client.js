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
router.get('/user/account', db.User.clientAuth, (req, res) => {
    res.render('account');
});

/* Documents store */
router.get('/documents', db.User.clientAuth, (req, res) => {
    res.render('documents');
});

/* Document Editor */
router.get('/documents/:docId', db.User.clientAuth, (req, res) => {
    res.render('editor', {document: req.params.docId});
});

module.exports = router;
