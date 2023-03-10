const newsRouter = require("./news");
const sideController = require("./side");
function route(app) {
  // cấu hình cho /news
  app.use("/news", newsRouter);

  app.use("/", sideController);

  app.post("/search", (req, res) => {
    console.log(req.body);
    res.send("");
  });
}
module.exports = route;
