const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const userModel = require("../modal/UserModal");
class UserModal {
  init(req, res) {
    const _id = req.params.id;
    console.log(_id);

    (async () => {
      if (_id) {
        const res = await userModel.findByIdAndDelete({ _id });
      }

      userModel
        .find()
        .lean()
        .then((data) => {
          res.render("adminLayout/user", {
            users: data,
            delete: _id,
            layout: "admin.hbs",
          });
        });
    })();
  }
  async update(req, res) {
    const { account, phone, address, fullname } = req.body;
    console.log(req.body);
    if (account && phone && address && fullname) {
      const data = await userModel.findOneAndUpdate(
        { username: account },
        { fullname, phone, address }
      );

      return res.json(data);
    }
    return res.json({ status: 403, message: "Lỗi" });
  }
  async register(req, res) {
    let username, password, permission;
    const { adminusername, adminpassword, adminpermission } = req.body;
    if (adminusername && adminpassword) {
      username = adminusername;
      password = adminpassword;
      permission = adminpermission;
    } else {
      const account = req.body.data;
      username = account.username;
      password = account.password;
      permission = account.permission;
    }
    try {
      const checkAccount = await userModel.findOne({
        username,
      });
      if (checkAccount) {
        if (adminusername) {
          res.redirect("/admin/user");
          return;
        }
        res.status(202).json({ message: "Tài khoản tồn tại rồi", status: 403 });
        return;
      } else {
        const Newpassword = await argon2.hash(password);
        const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
        console.log(accessToken);
        console.log(username, password, permission);
        const data = await userModel.create({
          username,
          password: Newpassword,
          accessToken,
          permission,
        });
        if (adminusername) {
          res.redirect("/admin/user");
          return;
        }
        res.status(200).json({
          status: 200,
          message: "Tạo tài khoản thành công",
          account: data,
          accessToken,
        });
      }
    } catch {}
  }
  async login(req, res) {
    try {
      const { username, password } = req.body.data;
      console.log(req.body.data);
      const account = await userModel.findOne({ username });
      if (!account) {
        res.json({ message: "Tài khoản không tồn tại", status: 403 });
        return;
      }
      const checkPassword = await argon2.verify(account.password, password);
      if (checkPassword) {
        res.json({ message: "Đăng nhập thành công ", status: 200, account });
      } else {
        res.json({ message: "Mật khẩu không chính xác", status: 201, account });
      }
    } catch {
      res.json({ message: "Lỗi gì đó" });
    }
  }
}
module.exports = new UserModal();
