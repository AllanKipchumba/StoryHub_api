const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

// sign up
router.route("/register").post(async (req, res) => {
  try {
    const createUser = new User(req.body);
    await createUser.save();

    // generate Auth tokens for user at sign up
    const token = await createUser.generateAuthTokens();

    const user = {
      email: createUser.email,
    };
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).json(`Error: ${error}`);
    console.log(error);
  }
});

// log in
router.route("/login").post(async (req, res) => {
  try {
    const identifyUser = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    // generate Auth tokens for user at log in
    const token = await identifyUser.generateAuthTokens();
    const user = {
      email: identifyUser.email,
    };
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

// log out
router.route("/logout").post(auth, async (req, res) => {
  try {
    // filter out the token belonging to the device the user used at log in
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
});

module.exports = router;
