const CategoryModal = require("../modal/CategoryModal");

class CategoryController {
  init(req, res) {
    CategoryModal.find()
      .lean()
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        res.status(404).json({ status: 200, message: "oke", categories: [] });
      });
  }
  getCategory(req, res) {
    const { slug } = req.params;
    if (!slug) {
      return res
        .status(404)
        .json({ status: 404, message: "Can't find category" });
    }
    (async () => {
      try {
        const data = await CategoryModal.findOne({ slug });

        res.render("product", { kind: data.id });
      } catch {}
    })();
  }
}
module.exports = new CategoryController();
