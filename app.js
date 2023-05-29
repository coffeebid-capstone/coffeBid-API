import cloudDebug from "@google-cloud/debug-agent"
import express from "express";
import bodyParser from "body-parser"
import session from "express-session"
import postImageRouter from "./routes/postImage.js";
import db from "./config/database.js";
import UserRoute from "./routes/UserRoute.js"
import ProductRoute from "./routes/ProductRoute.js"
import AuthRoute from "./routes/AuthRoute.js";
import SequelizeStore from "connect-session-sequelize"
cloudDebug.start()
const app = express();

const sessionStore = SequelizeStore(session.Store)
const store = new sessionStore({
    db: db
})

// (async () => {
//     await db.sync();
// })();

app.use(session({
    secret: "MM5ckam0eYhzVh6U",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(postImageRouter);
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

store.sync();

app.listen(3000, () => {
    console.log("Halo Guys");
})

