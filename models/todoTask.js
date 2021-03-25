const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        category: { type: String },
        date: { type: Date, default: Date.now }
    }
)
module.exports = mongoose.model('TodoTask', todoTaskSchema);