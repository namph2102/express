const ProductModel = require("../modal/ProductModal");

class ProductController {
  init(req, res) {
    return res.render("product");
  }
  async getProduct(_, res) {
    await ProductModel.findOne({ id: 1 }).then((data) => {
      return res.render("productDetail");
    });
  }
  // admin routering
}
module.exports = new ProductController();
