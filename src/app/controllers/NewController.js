class NewsController {
  index(req, res) {
    res.render("new");
  }
  addnew(req, res) {
    res.render("search");
  }
}
module.exports = new NewsController();
