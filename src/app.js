//import configuration
const config = require("./config/config");
const express = require("express");
// mongodb  connection
require("./db/mongoose");
const userRouter = require("./routers/users");
const postRouter = require("./routers/posts");
const commentsRouter = require("./routers/comments");
const likesRouter = require("./routers/likes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//configure routes
app.use("/api/auth", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/post/comment", commentsRouter);
app.use("/api/post/", likesRouter);

const port = config.prod_port || config.dev_port;

app.listen(port, () => console.log(`App listening on port ${port}`));