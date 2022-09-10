require("dotenv").config();
const express = require("express");
const userRouter = require("./routers/users");
const postRouter = require("./routers/posts");
const commentsRouter = require("./routers/comments");
const mongoose = require("mongoose");
const cors = require("cors");

// mongodb  connection
const mongodb_uri = process.env.MONGODB_URL_LOCAL;
mongoose.connect(`${mongodb_uri}`, {
    useNewUrlParser: true,
});
// end of db connection

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/post", commentsRouter);

app.listen(port, () => console.log(`App listening on port ${port}`));