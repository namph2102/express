// import showProductCart from './module.js';

import * as module from "./module.js";

async function showPageCartBag() {
  await showProductsViewHome(0, 1);
  HandleCart();
  handleHearts();
  module.default(carts.show());
  const totalPrice = $$(".box_bill_pay-subtotal_coin");
  document
    .querySelector(".table__content--body")
    .addEventListener("click", function (e) {
      if (e.target.closest("button")) {
        const parentElement = e.target.closest("button");
        const id = parentElement.dataset.id;
        const inputEle = parentElement.parentNode.querySelector("input");
        let amounts = Number(inputEle.value);
        const boxItem = parentElement.closest(".table__content--item");
        let totalOrder = coverNumber(totalPrice.innerHTML.trim()) / 1000;
        const { priceSale } = API.find((item) => item.id == id);
        if (parentElement.dataset.type == "increase") {
          if (amounts >= 10) return;
          ++amounts;
          totalOrder += priceSale;
          if (amounts == 2)
            parentElement.parentNode.firstElementChild.innerHTML = `<i class="fa-solid fa-minus"></i>`;

          carts.update(id, 1);
        } else {
          --amounts;
          if (amounts == 1) {
            parentElement.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
          }
          carts.update(id, -1);
          totalOrder -= priceSale;
        }
        if (amounts <= 0) {
          carts.delete(id);
          boxItem.classList.add("hidden");
        }
        totalPrice.innerHTML = coverPrice(totalOrder) + " đ";
        $$(".box_bill_pay-total_coin").textContent =
          coverPrice(totalOrder * 1.05) + " đ";
        boxItem.querySelector(".table__content--total__contain").textContent =
          coverPrice(amounts * priceSale) + " đ";
        inputEle.value = amounts;
      }
      if (e.target.closest(".size")) {
        carts.update(e.target.dataset.id, null, e.target.dataset.size);
      }
    });

  document
    .querySelector(".modal__body--product__list")
    .addEventListener("click", function (e) {
      if (e.target.closest("button")) {
        module.default(carts.show());
      }
    });
  document.querySelector(".btn--table__order").onclick = () => {
    const boxCart = document.querySelector(".carts__address");
    let heightcart = boxCart.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo(0, heightcart);
  };
  const listInput = document.querySelectorAll(".form__user--address input");
  const [username, phone, address, fullname] = listInput;
  console.log(username, phone, address);
  username.value = localStorage.getItem("fullname") || "";
  phone.value = localStorage.getItem("phone") || "";
  address.value = localStorage.getItem("address") || "";

  const formOrder = document.querySelector("form.form__user--address");

  $$(".btn__submit--order").onclick = () => {
    listInput.forEach((input) => {
      handleInput(input, " không được để trống !", 4);
      const submitForm = [...listInput].some(
        (input) => handleInput(input) == false
      );
      if (!submitForm) {
        localStorage.setItem("fullname", username.value);
        localStorage.setItem("phone", phone.value);
        localStorage.setItem("address", address.value);

        const ssss = JSON.parse(localStorage.getItem("user")).username || "";
        console.log(ssss, username.value, phone.value, address.value);
        $.post(
          "/user/update",
          {
            account: ssss,
            fullname: username.value,
            phone: phone.value,
            address: address.value,
          },
          function (resposive, err) {
            if (resposive._id) {
              localStorage.setItem("idAccount", resposive._id);
            }
            window.location.href = "/bill";
          }
        );
      }
    });
  };
}
showPageCartBag();
