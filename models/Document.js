/**
 * Mongoose models and classmethods for interacting with Documents
 */

// module.exports = {
//     Document: Document,
//     otherStuff: "etc..."
// };

module.exports = function Documents (docName, collaborators, createdAt, lastUpdated) {
    this.docName = docs;
    this.collaborators = collaborators;
    this.createdAt = createdAt;
    this.lastUpdated = lastUpdated;
    this.test = function() {
        console.log('Document Name: ' + this.docName + ' collaborators: ' + this.collaborators);
    };
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const documentSchema = new Schema({
    docName: { type: String, required: true },
    collaborators: { type: String, required: true },
    createdAt: { type: Date, required: true },
    lastUpdated: { type: Date, required: true, default: Date.now }
    });

const Doc = mongoose.model('Doc', documentSchema);
