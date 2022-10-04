const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, ],
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;