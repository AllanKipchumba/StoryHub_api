const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    authorName: {
        type: String,
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
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, ],
}, { timestamps: true });

const Comment = mongoose.model("comment", commentsSchema);
module.exports = Comment;