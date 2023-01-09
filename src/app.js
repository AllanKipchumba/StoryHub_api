//import configuration
const config = require("./config/config");

require("./db/mongoose");
const express = require("express");
const cors = require("cors");
const userRouter = require("./routers/users");
const postRouter = require("./routers/posts");
const commentsRouter = require("./routers/comments");
const likesRouter = require("./routers/likes");

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