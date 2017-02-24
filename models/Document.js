/**
 * Mongoose models and classmethods for interacting with Documents
 */
const mongoose = require('mongoose');
// const db = require("../models/db");
// var ObjectId = require('mongodb').ObjectID;

const Schema = mongoose.Schema;

// Document Schema
const documentSchema = new Schema({
    docName: { type: String, required: true, default: "untitled" },
    owners: { type: Array, required: true },
    collabs: { type: Array, required: true, default: "" },
    contents: { type: String, default: ""},
    history: {
        fDate: { type: Date, required: true, default: Date.now()  },
        tDate: { type: Date, required: true,
                default: new Date().toISOString() },
        contents: { type: String, default: "" }
    },
    createdAt: { type: Date, required: true, default: Date.now },
    lastModified: { type: Date, required: true, default: Date.now }
});

/* Function that validates document authentication level */

// const docAuth = (req, res, next) => {
//     var isOwner = false;
//     var isCollab = false;
//     var documentId = req.params.id;
//     const regularExpression = new RegExp(".*" + req.session.userId + ".*");
//     console.log(documentId);
//     Doc.findOne({ $and: [ { "_id": ObjectId(documentId)}, {owners: regularExpression}]})
//         .then((results) => {
//             if (!results) {
//                 Doc.findOne({ $and: [ { "_id": ObjectId(documentId)}, {collabs: regularExpression}]})
//                     .then((results) =>{
//                         console.log("checking if collab");
//                         if (results) {
//                             console.log(isCollab);
//                             isCollab = true;
//                             return isCollab;
//                             console.log(isCollab);
//                             next();
//                         }
//                     })
//                     .catch((err) => {});
//             } else {
//                 console.log("user should be an owners");
//                 isOwner = true;
//                 console.log(isOwner);
//                 return isOwner;
//                 return next();
//             }
// })
// };
//
// /* Define a static method that responds to API auth confirmation requests */
// documentSchema.statics.apiAuth = (req, res, next) => {
//     console.log(isOwner);
//         return isOwner;
//         return isCollab;
//         return next();
//
//     res.status(401)
//         .json({
//             "message": "Not authorized",
//             "data": {},
//             "success": false
//         });
// }
//
// /* Define a static method that responds to client auth confirmation requests */
// documentSchema.statics.clientAuth = (req, res, next) => {
//     if (docAuth(req) === true) {
//         return next();
//     }
//     res.redirect('/api/documents');
// }

const Doc = mongoose.model('Doc', documentSchema);

module.exports = Doc;
