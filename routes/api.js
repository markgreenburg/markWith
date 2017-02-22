'use strict';
const config = require("../models/Config");
const User = require("../models/User");
const Document = require("../models/Document");

/**
 * API routes; mounted at /api
 */

const router = require('express').Router();

/* View all and create new documents */
router.post('/documents', (req, res, next) {
    mongoose.connect(Config.mongoConfig.db);
    var regularExpression = new RegExp("/" + req.session.email + "/");
    Doc.find( {$or: [{owners: regularExpression}, {collabs: regularExpression}]}).exec(function(myDocs){
        if (myDocs) {
        console.log(myDocs);
        var myDocuments = [];
        for (var i = 0; i < myDocs.length; i++) {
            myDocuments.push(myDocs[i]);
        }
    res.json(myDocuments);
    }
    else {
        res.json({
            message: "You have no current documents."
        })
    }
    });
});

/* Putting get documents route in api for documents, may revisit */
router.get('/documents', (req, res, next) {
    res.render('docs_dashboard', {myDocuments: myDocuments});
});

/* Create new document route, will modifiy/merge just a working version */
router.post('/documents/create', (req, res, next) {
    mongoose.connect(Config.mongoConfig.db);
    let newDoc = new Doc();
    newDoc.save(function(err) {
        if (err)
            throw err;
        else
            console.log('new document created successfully...');
    });
});

/* New Document get route, again will revisit */
router.get('/documents/create', (req, res, next) {
    res.render('doc_template', session: req.session);
});

/* Also putting get route in api with post, may revisit */
router.get('/documents/:id', (req, res, next) {
    res.render('doc_screen', { session: req.session, myDoc: myDoc });
})

/* Also putting get document id route in api with post, may revisit */
router.post('/documents/:id', (req, res, next) => {
    mongoose.connect(Config.mongoConfig.db);
    var documentId = req.params.id;
    Doc.findOne({_id: documentId}).exec(function(myDoc) {
        if (myDoc) {
            res.json(myDoc);
        }
        else {
            res.json({
                message: "This document does not exist."
            })
        }
    });

});


/* Create account for new user */
router.post('/user/register', (req, res) => {
    // Create an account and respond
});

/* Log in existing user */
router.post('/user/login', (req, res) => {
    // Log user in and respond
});

module.exports = router;
