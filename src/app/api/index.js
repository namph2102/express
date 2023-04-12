const Product = require("../modal/ProductModal");
class Api {
  productApi(req, res) {
    Product.find({})
      .lean()
      .then((data) => {
        if (data.length <= 0) {
          return res
            .status(404)
            .json({ status: 404, message: "cant not found" });
        }
        return res.status(200).json(data);
      })
      .catch((err) => {
        res.status(404).json({ status: 404, message: "Lỗi  rồi nha !" });
      });
  }
}
module.exports = new Api();
