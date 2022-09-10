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
        ref: "User",
    },
    categories: {
        type: Array,
        required: false,
    },
}, { timestamps: true });

//create a virtual relationship with Comment model
PostSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "post",
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;