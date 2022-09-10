const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    comment: {
        type: string,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
});

const Comment = mongoose.model("Comment", commentsSchema);