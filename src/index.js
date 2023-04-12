const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const fs = require("fs");
const { exists } = require("fs");
const { engine } = require("express-handlebars");

const adminRouter = require("./routes/admin");
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const router = require("./routes/index");
const db = require("./app/modal/connectDB");
const { extend } = require("slug");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
const port = 3000;

db.connectDB();
router(app, engine);
adminRouter(app, engine);

app.listen(port, () => {
  console.log("--------------");
  console.log("server runing");
});
