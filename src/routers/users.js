const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

// sign up
router.route("/register").post(async(req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        // generate Auth tokens for user at sign up
        const token = await user.generateAuthTokens();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).json(`Error: ${error}`);
        console.log(error);
    }
});

// log in
router.route("/login").post(async(req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        // generate Auth tokens for user at log in
        const token = await user.generateAuthTokens();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(`Error: ${error}`);
    }
});

module.exports = router;