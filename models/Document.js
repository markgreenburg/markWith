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
        fDate: { type: Timestamp, required: true },
        tDate: { type: Timestamp, required: true }
        }
    });

module.exports = mongoose.model('Doc', documentSchema);
