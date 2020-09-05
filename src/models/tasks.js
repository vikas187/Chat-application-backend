const mongoose = require('mongoose');
const validator = require('validator');
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
}

);
taskSchema.pre('save', async function(next) {
    console.log("just before saving task");
});

const Task = mongoose.model('Task', taskSchema);




module.exports = Task;