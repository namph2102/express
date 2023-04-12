const cartModel = require("../modal/CartModel");
const productsModel = require("../modal/ProductModal");
const userModal = require("../modal/UserModal");
class CartController {
  init(req, res) {
    console.log("hello");
    res.render("cart", { layout: "main" });
  }
  async adToCart(req, res) {
    const { userID, data } = req.body;
    console.log(data);
    const newAccoutn = await cartModel.create({
      user: userID,
      products: [...data],
    });
  }
  async show(req, res, next) {
    const products = await cartModel.find({}).lean().populate("user");
    res.render("adminLayout/Showcart", {
      layout: "admin.hbs",
      products: products,
    });
  }
  async getProduct(req, res) {
    const id = req.body._id;

    const resdata = await cartModel.findOne({ _id: id }).select("products");
    const result = await productsModel.find({
      _id: {
        $in: [...resdata.products.map((item) => item.id)],
      },
    });
    const converData = result.map((item, index) => ({
      item,
      amount: resdata.products[index].amount,
    }));
    res.json({ listData: converData });
  }
  async deleteProduct(req, res) {
    const id = req.params.id;
    await cartModel.findByIdAndDelete({ _id: id });
    res.redirect("/cart/showcart");
  }
  async bagDelete(req, res) {
    const [id, _id] = req.params.id.split("|");
    await cartModel.updateOne({ _id }, { $pull: { products: { id } } });
    res.redirect("/cart/showcart");
  }
  async handleStatus(req, res) {
    const objStatus = {
      "xác nhận": "thanh toán",
      "thanh toán": "hoàn thành",
    };
    const resCart = await cartModel.findById({ _id: req.params.id });
    console.log(resCart);
    await cartModel.findByIdAndUpdate(
      { _id: req.params.id },
      { status: objStatus[resCart.status.toLowerCase()] }
    );
    res.redirect("/cart/showcart");
  }
  async getOrder(req, res) {
    res.render("order");
  }
  async handleListOrder(req, res) {
    const username = req.body.username;

    const account = await userModal.findOne({ username });
    if (account) {
      const listcart = await cartModel
        .find({ user: account._id })
        .populate("user");
      res.status(200).json({ data: listcart, status: 200, message: "ok" });
    } else {
      res.status(200).json({ data: [], message: "no have" });
    }
  }
}
module.exports = new CartController();
