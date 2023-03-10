const express = require("express");
const { engine } = require("express-handlebars");
const morgan = require("morgan");
const path = require("path");
const app = express();
const port = 3000;
const route = require("./routes");
// app.use(morgan("combined"));

app.use(express.static(path.join(__dirname, "resources\\public")));
app.use(express.urlencoded({ extended: true }));

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources\\views"));

app.get("/", function (req, res) {
  res.render("home");
});
route(app);

app.listen(port, () => {
  console.log("adsdsa");
});
