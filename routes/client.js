'use strict';
const router = require('express').Router();
const config = require("../config");
const db = require("../models/db");

/**
 * Client-side routes; mounted at / (root)
 */

/* Home Page */
router.get('/', (req, res) => {
    res.render('home', {session: req.session});
});

/* Registration page */
router.get('/user/register', (req, res) => {
    if (req.session.token) {
        res.redirect('/user/account');
    } else {
        res.render('register');
    }
  });

/* Login page */
router.get('/user/login', (req, res) => {
    if (req.session.token) {
        res.redirect('/user/account');
    } else {
        res.render('login');
    }
});

/* Account Profile */
router.get('/user/account', db.User.clientAuth, (req, res) => {
    res.render('account', {session: req.session});
});

/* Documents store */
router.get('/documents', db.User.clientAuth, (req, res) => {
   db.Doc.getAllDocs(req, (docs) => {
        res.render('documents', {docs: docs.data, session: req.session});
    });
});

/* Document Editor */
router.get('/documents/:docId', db.User.clientAuth, db.Doc.clientCollab,
        (req, res) => {
    res.render('editor', {
            documentId: req.params.docId,
            session: req.session
    });
});

/* Demo Document Editor */
router.get('/demo', (req, res) => {
    // To-Do: update test user for prod
    const newTestDoc = new db.Doc({owners: [config.testUser._id]});
    newTestDoc.save()
        .then((result) => {
            const uri = '/demo/' + result._id;
            res.redirect(uri);
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/');
        })
});

/* Demo document editor shareable link for existing docs */
router.get('/demo/:id', (req, res) => {
    db.Doc.findOne({_id: req.params.id})
        .then((result) => {
        // To-Do: more robust test user stuff for production
            if (result) {
                result.owners.forEach((owner) => {
                    if (owner == config.testUser._id) {
                        res.render('demo_editor',
                                {documentId: req.params.documentId});
                    }
                });
            }
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/');
        });
});

module.exports = router;
