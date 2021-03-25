const mongoose = require('mongoose');
const todoCategorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true }
    }
)
module.exports = mongoose.model('TodoCategory', todoCategorySchema);