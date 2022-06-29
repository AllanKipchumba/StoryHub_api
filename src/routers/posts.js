const express = require("express");
const router = new express.Router();
const Post = require("../models/posts");
const auth = require("../middleware/auth");

// chained route handlers
router
    .route("/posts")
    .post(auth, async(req, res) => {
        const post = new Post({
            ...req.body,
            owner: req.user._id,
        });
        try {
            await post.save();
            res.status(201).send(post);
        } catch (e) {
            res.send(e);
        }
    })
    // GET /tasks?completed=true
    // GET /tasks?limit=10&skip=10
    // GET /tasks?sortBy=createdAt_asc
    .get(auth, async(req, res) => {
        const match = {};
        const sort = {};

        // if a query parameter is idedprov to the endpoint
        if (req.query.completed) {
            // create a key-value(boolean) pair for the declared object
            match.completed = req.query.completed === "true";
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        }

        try {
            // populate all tasks associated with this user
            await req.user.populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort,
                },
            });
            res.send(req.user.tasks);
        } catch (e) {
            res.status(500).send(e);
            console.log(e);
        }
    });
router
    .route("/tasks/:id")
    .get(auth, async(req, res) => {
        const _id = req.params.id;

        try {
            const task = await Task.findOne({ _id, owner: req.user._id });

            if (!task) {
                return res.status(404).send();
            }
            res.send(task);
        } catch (e) {
            res.status(500).send(e);
        }
    })
    .patch(auth, async(req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = ["description", "completed"];
        const isValidOperation = updates.every((update) =>
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).send({ Error: "Invalid updates!" });
        }
        try {
            const task = await task.findOne({
                _id: req.params.id,
                owner: req.user._id,
            });

            if (!task) {
                return res.status(404).send();
            }

            updates.forEach((update) => (task[update] = req.body[update]));

            await task.save();
            res.send(task);
        } catch (e) {
            res.status(400).send(e);
        }
    })
    .delete(auth, async(req, res) => {
        try {
            const task = await Task.findOneAndDelete({
                _id: req.params.id,
                owner: req.user._id,
            });

            if (!task) {
                return res.status(404).send();
            }
            res.send(task);
        } catch (e) {
            res.status(500).send();
        }
    });

module.exports = router;