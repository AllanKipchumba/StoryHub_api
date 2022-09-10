const express = require("express");
const router = new express.Router();
const Comment = require("../models/comments");
const auth = require("../middleware/auth");
const Post = require("../models/posts");

router.route("/:id/comment").post(auth, async(req, res) => {
    try {
        // find out which post you are commenting
        const id = req.params.id;
        // get the comment text and record post id
        const comment = new Comment({
            text: req.body.comment,
            post: id,
        });
        // save comment
        await comment.save();

        // get this particular post
        const commentedPost = await Post.findById(id);
        // push the comment into the post.comments array
        commentedPost.comments.push(comment);
        //save
        await commentedPost.save();
        //return th comments
        res.status(200).send(commentedPost.comments);
    } catch (error) {
        res.send(`Error: ${error}`);
    }
});

module.exports = router;