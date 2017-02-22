/**
 * Mongoose models and classmethods for interacting with Documents
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Document Schema
const documentSchema = new Schema({
    docName: { type: String, required: true, default: "untitled" },
    owners: { type: Array, required: true, default: ["req.session.email"] },
    collaborators: { type: Array, required: true },
    content: String,
    history: {
        fDate: { type: Date, required: true, default: new Date();  },
        tDate: { type: Date, required: true, default: ISODate(); },
        content: { type: String, required: true }
        },
    createdAt: { type: Date, required: true, default: new Date(); },
    // ObjectId("id").getTimestamp() --> internal timestamp of file
    lastModified: { type: Date, required: true, default: new Date(); }
    });

module.exports = mongoose.model('Doc', userSchema);
