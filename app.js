// dependencies
require('@google-cloud/debug-agent').start();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
// import files
const postImageRouter = require("./routes/postImage");
const db = require("./config/database");

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(postImageRouter);
app.use(express.json());

(async () => {
    await db.sync();
})();

app.use(session({
    secret: "MM5ckam0eYhzVh6U",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}));

app.listen(3000, () => {
    console.log("Halo Guys");
})

