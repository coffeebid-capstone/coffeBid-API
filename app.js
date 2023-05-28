import cloudDebug from "@google-cloud/debug-agent"
cloudDebug.start()
import express from "express";
const app = express();
import bodyParser from "body-parser"
import session from "express-session"
import postImageRouter from "./routes/postImage.js";
import db from "./config/database.js";
import UserRoute from "./routes/UserRoute.js"
import ProductRoute from "./routes/ProductRoute.js"



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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(postImageRouter);
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);

app.listen(3000, () => {
    console.log("Halo Guys");
})

