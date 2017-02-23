/**
 * Mongoose models and classmethods for interacting with Documents
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Document Schema
const documentSchema = new Schema({
    docName: { type: String, required: true, default: "untitled" },
    owners: { type: Array, required: true },
    collaborators: { type: Array, required: true, default: "" },
    content: { type: String, default: ""},
    history: {
        fDate: { type: Date, required: true, default: Date.now  },
        tDate: { type: Date, required: true,
                default: new Date().toISOString() },
        content: { type: String, default: "" }
    },
    createdAt: { type: Date, required: true, default: Date.now }
    lastModified: { type: Date, required: true, default: Date.now }
});

const Doc = mongoose.model('Doc', documentSchema);

module.exports = Doc;
