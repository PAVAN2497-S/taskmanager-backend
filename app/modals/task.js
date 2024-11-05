const mongoose = require("mongoose");
const { model, Schema } = mongoose

const taskSchema = new Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['done', 'in-progress', 'todo'],
        default: 'todo'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })
const Task = model('Task', taskSchema)
module.exports = Task