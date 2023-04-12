const homeRouter = require("./home");
const productRouter = require("./product");
const appAll = require("./api");
const categoryRouter = require("./category");
const UserRouter = require("./user");
const cartRouter = require("./cart");
const CartController = require("../app/controller/CartController");
function route(app, engine) {
  // Rendering engine setup
  app.engine(".hbs", engine({ extname: ".hbs", defaultLayout: "main" }));
  app.use("/", homeRouter);
  app.use("/product", productRouter);
  app.use("/api", appAll);

  app.get("/about", (req, res) => {
    res.render("aboutus");
  });

  app.get("/tin-tuc-chi-tiet", (req, res) => {
    res.render("newDetail");
  });
  app.get("/news", (req, res) => {
    res.render("news");
  });
  app.get("/contact", (req, res) => {
    res.render("contact");
  });
  app.use("/cart", cartRouter);
  app.get("/bill", (req, res) => {
    res.render("bill", { layout: false });
  });
  app.get("/order", CartController.getOrder);
  app.use("/user", UserRouter);
  app.use("/categories", categoryRouter);
}
module.exports = route;
