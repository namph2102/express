const CateloryModel = require("../modal/CategoryModal");
class HomeController {
  init(req, res) {
    CateloryModel.find()
      .lean()
      .then((categories) => {
        return res.render("home", {
          banner: true,
          categories,
        });
      })
      .catch((err) => {
        {
          return res.render("home", { banner: true });
        }
      });
  }
}
module.exports = new HomeController();
