const express = require("express")
const router = new express.Router()
const User = require("../models/user")
const auth = require("../middleware/auth")
const multer = require("multer")
const sharp = require("sharp")
// const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account")

//  CHAINED ROUTE HANDLERS

router.route("/users")
    // sign up
    .post(async(req, res) => {
        try {
            const user = new User(req.body)
            await user.save()
            // sendWelcomeEmail(user.email, user.name)
                // generate Auth tokens for user at sign up
            const token = await user.generateAuthTokens()

            res.status(201).send({ user, token })
        } catch (e) {
            res.status(400).send(e)
        }
    })
    // DISABLED read users ROUTE FOR SECURITY REASONS
    // A USER SHOULD NOT SEE OTHER USER'S EMAIL
    .get(async(req, res) => {
        res.status(204).send("No content! Unauthorised to read other users' email.")
        next()
            // try {
            //     const users = await User.find({})
            //     res.send(users)
            // } catch (e) {
            //     res.status(500).send()
            // }
            // User.find({}).then(users => res.send(users)).catch(e => res.status(500).send())
    })



// log in
router.route("/users/login")
    .post(async(req, res) => {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)
                // generate Auth tokens for user at log in
            const token = await user.generateAuthTokens()
            res.send({ user, token })
        } catch (e) {
            res.status(400).send(e)
        }
    })

// log out >> clear tokens from one device
router.route("/users/logout")
    // run the auth middleware before the route handler
    .post(auth, async(req, res) => {
        try {

            // filter out the token belonging to the device the user used at log in
            req.user.tokens = req.user.tokens.filter(token => {
                return token.token !== req.token
            })
            await req.user.save()

            res.send()
        } catch (e) {
            res.status(500).send()
        }
    })

// logout of all sessions
router.route("/users/logoutALL")
    .post(auth, async(req, res) => {
        try {
            // empty the tokens array
            req.user.tokens = []
            await req.user.save()

            res.send()
        } catch (e) {
            res.status(500).send(e)
        }
    })

router.route("/users/me")
    // read individual user
    .get(auth, async(req, res) => {
        res.send(req.user)
    })
    // update user
    .patch(auth, async(req, res) => {
        // allowed updates
        const updates = Object.keys(req.body)
        const allowedUpdates = ["name", "email", "password", "age"]
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ Error: "Invalid updates!" })
        }

        try {
            updates.forEach(update => req.user[update] = req.body[update])
            await req.user.save()
            res.send(req.user)
        } catch (e) {
            res.status(400).send(e)
        }
    })
    // delete user
    .delete(auth, async(req, res) => {
        try {
            await req.user.remove()
            // sendCancelationEmail(req.user.email, req.user.name)
            res.send(req.user)
        } catch (e) {
            res.status(500).send()
        }
    })

const upload = multer({
    limits: {
        // limit file size to 10mb >> 10000000 bytes
        fileSize: 10000000
    },
    // validate file type >> only allow jpg, jpeg, png
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload a picture"))
        }
        cb(undefined, true)
    }
})
router.route("/users/me/avatar")
    // upload avatar
    .post(auth, upload.single("avatar"), async(req, res) => {
        // pass the img file through sharp to uniform its size and format
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer

        await req.user.save()
        res.send()
    }, (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    })
    // delete avatar
    .delete(auth, async(req, res) => {
        // clear the avatar fiels
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    })


// serving up user profile image
router.get("/users/:id/avatar", async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set("Content-Type", "image/png")
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router