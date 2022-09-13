const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Comment = mongoose.model("comment", commentsSchema);
module.exports = Comment;