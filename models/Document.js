/**
 * Mongoose models and classmethods for interacting with Documents
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    docName: { type: String, required: true },
    owners: { type: Array, required: true },
    collaborators: { type: Array, required: true },
    docState: {
        fDate: { type: Date, required: true },
        tDate: { type: Date, required: true }
        }
    });

module.exports = mongoose.model('Doc', documentSchema);
