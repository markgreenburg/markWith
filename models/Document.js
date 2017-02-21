/**
 * Mongoose models and classmethods for interacting with Documents
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    docName: { type: String, required: true },
    collaborators: { type: Array, required: true },
    createdAt: { type: Date, required: true },
    lastUpdated: { type: Date, required: true, default: Date.now }
    });

module.exports = mongoose.model('Doc', documentSchema);
