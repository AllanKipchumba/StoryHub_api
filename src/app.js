require("dotenv").config();
const express = require("express");
const userRouter = require("./routers/users");
const postRouter = require("./routers/posts");
const commentsRouter = require("./routers/comments");
const likesRouter = require("./routers/likes");
const mongoose = require("mongoose");
const cors = require("cors");

// mongodb  connection
const mongodb_uri = process.env.MONGODB_URL;
mongoose.connect(`${mongodb_uri}`, {
    useNewUrlParser: true,
});
// end of db connection

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
//allow cross-origin resource sharing
app.use(cors());

//configure routes
app.use("/api/auth", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/post/comment", commentsRouter);
app.use("/api/post/", likesRouter);

app.listen(port, () => console.log(`App listening on port ${port}`));