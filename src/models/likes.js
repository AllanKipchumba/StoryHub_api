const mongoose = require("mongoose");

const likes_Schema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    postID: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
});

const Like = mongoose.model("like", likes_Schema);
module.exports = Like;