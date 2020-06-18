const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const posts = require("./routes/api/post");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/post", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
