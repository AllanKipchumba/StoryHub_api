const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    imageURL: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, ],
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;