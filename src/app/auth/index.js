const jwt = require("jsonwebtoken");
const Authorization = async (req, res, next) => {
  try {
    const { username, permission } = req.body.account;
    const token = req.body._token;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      console.log(err, data);

      if (err) return;
      if (data == username && permission == "admin") {
        next();
        res.status(200).json({
          message: "Chuyển vào trang admin",
          status: 200,
        });

        return;
      } else {
        res.status(202).json({
          message: "Bạn không có quyền truy cấp vào đây!",
          status: 202,
        });
      }
    });
  } catch {
    // res.status(202).json({
    //   message: "Bạn không có quyền truy cấp vào đây!",
    //   status: 202,
    // });
    res.redirect("/");
  }
};
module.exports = Authorization;
