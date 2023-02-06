const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const config = require("../config/config");

// sign up
router.post("/register", async (req, res) => {
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
router.post("/login", async (req, res) => {
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
router.post("/logout", auth, async (req, res) => {
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

//send Password reset link
router.post("/resetpassword", async (req, res) => {
  await User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }

      // Generate a random token
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Update the user's resetPasswordToken and resetPasswordExpires
      User.updateOne(
        { _id: user._id },
        {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 300000,
        },
        (err) => {
          if (err) throw err;

          // Send the password reset email
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: config.auth_user,
              pass: config.auth_pass,
            },
          });

          const dev_url = `http://localhost:3000/reset/${token}`;
          const prod_url = `https://storyhub.onrender.com/reset/${token}`;

          const mailOptions = {
            to: user.email,
            from: config.auth_user,
            subject: "StoryHub Password Reset",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
                   Please click on the following link, or paste this into your browser to complete the process. Link expires in 5 minutes:
                   ${prod_url} 
                   If you did not request this, please ignore this email and your password will remain unchanged.`,
          };

          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              return console.log(err);
            }
            return res.status(200).json("Email sent");
          });
        }
      );
    })
    .catch((err) => console.log(err));
});

// Reset password
router.put("/reset/:token", async (req, res) => {
  try {
    const userToModifyPass = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    // Check for user
    if (!userToModifyPass) {
      console.log("no such user");
      return res.status(404).json({ Usernotfound: "User not found" });
    }

    userToModifyPass.password = req.body.newPassword;
    await userToModifyPass.save();

    // generate Auth tokens for user
    const token = await userToModifyPass.generateAuthTokens();
    const user = {
      email: userToModifyPass.email,
    };

    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
