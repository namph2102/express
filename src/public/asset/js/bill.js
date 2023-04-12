const user = createStorage("user");
const carts = createStoreList("cart").show();
document.querySelector(".fullname").textContent = user.get("fullname");
document.querySelector(".phone").textContent = user.get("phone");
document.querySelector(".address").textContent = user.get("address");
let total = 0;
document.querySelector(".list-group").innerHTML =
  carts
    .map((item) => {
      total += item.priceSale * item.amount;
      return `<li class="list-group-item">
    <div class="list-group-item_flex">
        <img src="${item.avatar}">
        <div>
            <h6>${item.name}</h6>
            <small>${coverPrice(item.priceSale)} đ x ${item.amount}</small>
        </div>
    </div>
    <span class="total_item_paymoney">${coverPrice(
      item.priceSale * item.amount
    )} đ</span>
</li>`;
    })
    .join("") || "";
document.querySelector(".paytoltol").textContent =
  coverPrice(total * 1.05) + " đ";
const products = carts.map((item) => ({
  id: item._id,
  amount: item.amount,
  priceSale: item.priceSale,
}));

document.querySelector(".continue_xacthuc").onclick = () => {
  $(document).ready(function () {
    $.post(
      "/cart/addcart",
      {
        method: "post",
        data: products,
        userID: localStorage.getItem("idAccount"),
      },
      (res) => {
        console.log(res);
      }
    );
  });
  window.localStorage.removeItem("cart");
};
function coverPrice(number) {
  if (!Number(number)) return 0;
  return new Intl.NumberFormat().format(number * 1000);
}
