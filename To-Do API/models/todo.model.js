const mongoose = require('mongoose')

const toDoSchema = mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
        },

        completed: {
            type: Boolean,
        }
    }
);

const toDo = mongoose.model("toDo", toDoSchema);
module.exports = toDo;
