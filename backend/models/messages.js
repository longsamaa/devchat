const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;


const messageSchema = new mongoose.Schema({
    idRoom: {
        type: String,
        required: true
    },
    messages: [{
        sender: String,
        content: String,
    }
    ]


});

module.exports = mongoose.model("Message", messageSchema);