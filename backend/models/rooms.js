const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: [{
        type: String,
        name: String,
        required: true
    }
    ],
    lastMessage: String,
    type: String
});

module.exports = mongoose.model("Room", roomSchema);