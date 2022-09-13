const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
}, { timestamps: true });

const Comment = mongoose.model("comment", commentsSchema);
module.exports = Comment;