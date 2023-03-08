const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello  ss ss World!");
});

app.listen(port, () => {
  let a = 1,
    b = 2;
  let c = a + b;
  console.log(c);
  console.log(`Example app listening on port ${port}`);
});
