const express = require("express");

const app = express();
const port = 5000;
app.use(express.json());

app.get("/", (req, res) => {
    console.log(`Hello express`);
});

app.listen(port, () => console.log(`App listening on port ${port}`));