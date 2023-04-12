const ProductModal = require("../modal/ProductModal");
const UserModal = require("../modal/UserModal");
const CategoriesModal = require("../modal/CategoryModal");
const CartModel = require("../modal/CartModel");
const slug = require("slug");
const fs = require("fs");
const path = require("path");
const { existsSync } = require("fs");

class AdminController {
  async init(req, res) {
    const [products, user, cart] = await Promise.all([
      ProductModal.count(),
      UserModal.count(),
      CartModel.count(),
    ]);

    const total = await CartModel.find({}).select("products");
    let totalSum = 0;
    total.map((item) => {
      return item.products.map((subitem) => {
        totalSum += subitem.priceSale * subitem.amount;
      });
    });
    totalSum = (totalSum * 1000).toLocaleString("en-vi") + " đ";

    res.render("adminLayout/home", {
      layout: "admin",
      totalSum,
      products,
      user,
      cart,
    });
  }
  async getdata(req, res) {
    let productDashboard = await ProductModal.find()
      .sort({ Sales: -1 })
      .select("Sales name")
      .limit(6);
    res.status(200).json({ message: "ok", productDashboard });
  }
  showProduct(req, res) {
    (async () => {
      try {
        const currentPage = req.query.page || 1;

        const limit = 3;
        const data = await ProductModal.find()
          .lean()
          .skip((currentPage - 1) * 3)
          .limit(limit)
          .sort({ updatedAt: -1 });
        const length = await ProductModal.count();
        const totalPage = Math.ceil(length / limit);
        const nextPage =
          currentPage == totalPage ? false : Number(currentPage) + 1;

        const prePage = currentPage <= 1 ? false : Number(currentPage) - 1;
        const pages = [];
        for (let i = 0; i < totalPage; i++) {
          pages.push({ page: i + 1, current: currentPage == i + 1 });
        }
        res.render("adminLayout/product", {
          listproduct: data,
          pages,
          currentPage,
          nextPage,
          prePage,
          layout: "admin.hbs",
        });
      } catch {
        res.status(404).render("adminLayout/product", {
          listproduct: [],
          pages: [],
        });
      }
    })();
  }
  showform(req, res) {
    (async () => {
      try {
        const categories = await CategoriesModal.find().lean();
        res.status(200).render("adminLayout/showformproduct", {
          categories: categories,
          layout: "admin.hbs",
        });
      } catch {
        res.status(404).render({ status: 404, message: "lỗi" });
      }
    })();
  }
  handleAddproduct(req, res) {
    (async () => {
      try {
        const file = req.file;
        const avatar = "/image/cakes/" + file.filename;
        const newslug = slug(req.body.name);
        const length = await ProductModal.count();
        const newProduct = {
          id: length + 1,
          ...req.body,
          avatar,
          slug: newslug,
        };
        const resutt = await ProductModal.insertMany(newProduct);
        res.status(200).redirect("/admin/product");
      } catch {
        res.status(404).redirect("/admin/product");
      }
    })();
  }
  handleEditPrroduct(req, res) {
    try {
      const id = req.params.id;
      if (id) {
        (async () => {
          const data = await ProductModal.findById({ _id: id }).lean();
          const { avatar, name, kind, status, priceOrigin, priceSale } = data;
          const categories = await CategoriesModal.find().lean();
          console.log(data);
          return res.render("adminLayout/showformproduct", {
            categories,
            product: data,
            isSet: true,
            layout: "admin.hbs",
          });
        })();
      }
    } catch {
      return res.status(404).redirect("/admin/product");
    }
  }
  handleEditPostProduct(req, res) {
    (async () => {
      try {
        const _id = req.params.id;
        const { name, priceOrigin, priceSale, des, material, kind } = req.body;

        await ProductModal.findByIdAndUpdate(_id, {
          name,
          priceOrigin,
          priceSale,
          des,
          material,
          kind,
        });
      } catch {}
    })();
    res.status(200).redirect("/admin/product");
  }
  async handleDeleteProduct(req, res) {
    try {
      const id = req.params.id;

      const cart = await CartModel.updateMany(
        {},
        { $pull: { products: { id: id } } }
      );

      const data = await ProductModal.findById({ _id: id });
      let parent = __dirname.split("\\").slice(0, -2).join("/");
      console.log(cart);
      fs.unlinkSync(path.join(parent, "public", data.avatar));
      await ProductModal.findByIdAndDelete({ _id: id });
      res.status(200).redirect("/admin/product");
    } catch {
      res.status(404).send("Lỗi nhẹ");
    }
  }
}
module.exports = new AdminController();
