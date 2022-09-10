const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
});

const Comment = mongoose.model("comment", commentsSchema);
module.exports = Comment;