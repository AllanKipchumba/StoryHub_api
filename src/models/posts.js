const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    category: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;