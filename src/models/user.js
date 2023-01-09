const config = require("../config/config");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // run validation
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        // password should not be set to the string "password"
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password can not contain 'password'");
            }
        },
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }, ],
}, { timestamps: true });

// GENERATE AUTH TOKENS FOR USER
userSchema.methods.generateAuthTokens = async function() {
    const user = this;
    // create token
    const token = jwt.sign({ _id: user._id.toString() }, config.jwt_secret);

    // save token to db
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// HASH PLAIN TEXT PASSWORD BEFORE SAVING TO DB
userSchema.pre("save", async function(next) {
    const user = this;
    // when creating/updating password
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    // makes sure to run next() to save the user
    next();
});

// CHECK IF USER EMAIL EXISTS AND VALIDATE PASSWORD >>
//{ .statics - TARGETS User}
userSchema.statics.findByCredentials = async(email, password) => {
    // email: email  destructerd to {email}
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
};

// HIDE USER'S SENSITIVE DATA >>
//{ .methods - TARGETS user }
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};

const User = mongoose.model("User", userSchema);
module.exports = User;