/**
 * Mongoose models and classmethods for interacting with Documents
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Document Schema
const documentSchema = new Schema({
    docName: { type: String, required: true },
    owners: { type: Array, required: true },
    collaborators: { type: Array, required: true },
    docState: {
        fDate: { type: Timestamp, required: true },
        tDate: { type: Timestamp, required: true }
        },
    createdAt: { type: Date, required: true },
    lastModified: { type: Date, required: true, default: Date.now }
    });

module.exports = mongoose.model('Doc', documentSchema);
