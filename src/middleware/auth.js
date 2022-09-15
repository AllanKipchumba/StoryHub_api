const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");

        //verify user token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //find user with this token in db
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });
        if (!user) {
            throw new Error();
        }
        // give the route handler access to the user and user-token fetched from the db
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send(`Error: ${error}`);
    }
};

module.exports = auth;