require("dotenv").config();
const express = require("express");
const userRouter = require("./routers/users");
const postRouter = require("./routers/posts");
const mongoose = require("mongoose");

// mongodb  connection
const mongodb_uri = process.env.MONGODB_URL;
mongoose.connect(`${mongodb_uri}`, {
    useNewUrlParser: true,
});
// end of db connection

const app = express();
const port = 5000;
app.use(express.json());

app.use(userRouter);
app.use("/api/posts", postRouter);

app.listen(port, () => console.log(`App listening on port ${port}`));