const URL_BANNER = "/asset/json/banner.json";
const API_PRODUCTS = "/api/v2/products";
const API_KIND = "/categories/api";
const totalBox = $$(".modal__body__add--total .total__cart");
const totalCart = $$(".header__products-cart__count");
const modal__container_cart = $$("#modal__cart");

const carts = createStoreList("cart");
const hearts = createStoreList("hearts", false);
let API = [];

// show san phẩm ở modal
function showProductModal({
  id,
  name,
  avatar,
  priceOrigin,
  priceSale,
  des,
  kind,
}) {
  const box_reducer = $$(".modal__product__view--reducer");
  box_reducer.classList.remove("hidden");
  $$("#productName").innerHTML = name;
  $$(".product__views-des__price--sale").innerHTML =
    coverPrice(priceSale) + " đ";
  $$("del.product__views-des__price--origin").innerHTML =
    priceOrigin > priceSale ? coverPrice(priceOrigin) + " đ" : "";
  $$(".product__views--item__des").innerHTML = des;
  if (kind != 2) {
    $$(".modal__item--product_size").innerHTML = `
            <input type="radio" checked name="size" id="sizeS"> <label for="sizeS">S</label>
            <input type="radio" name="size" id="sizeM"> <label for="sizeM">M</label>
            <input type="radio" name="size" id="sizeL"> <label for="sizeL">L</label>
        `;
  } else {
    $$(".modal__item--product_size").innerHTML = "24 lon";
  }

  const redusePrice = percentReduce(priceOrigin, priceSale);
  if (redusePrice) box_reducer.innerHTML = `-${redusePrice} %`;
  else box_reducer.classList.add("hidden");

  $$(".product-modal--avata").src = avatar;
  $$(".modal__dialog").classList.remove("hidden");

  $$(".modal__item--product_amount span").innerHTML =
    carts.getItem(id)?.amount || 1;
  $$(".product_add--cart").onclick = () => {
    if (carts.check(id)) {
      const size =
        ($$("#sizeS").checked && "S") ||
        ($$("#sizeM").checked && "M") ||
        ($$("#sizeL").checked && "L");
      carts.update(
        id,
        Number($$(".modal__item--product_amount span").innerText)
      );
      carts.update(id, null, size);
      $$(".product_add--cart").innerHTML = `Đã thêm vào giỏ hàng`;
    } else {
      carts.add(API.find((item) => item.id == id));
    }
    $$(".modal__dialog").classList.add("hidden");
    showKind(API.filter((item) => item.id == id).kind);
    HandleCart();
    $$("#modal__cart").classList.remove("hidden");
  };
}
document
  .querySelector(".modal__item--product_amount")
  .addEventListener("click", function (e) {
    const amountContent = this.querySelector("span");
    const value = Number(amountContent.innerText);
    if (e.target.closest(".product_amount--reduce")) {
      if (value > 1) amountContent.innerHTML = value - 1;
    }
    if (e.target.closest(".product_amount--increase")) {
      if (value < 10) {
        amountContent.innerHTML = value + 1;
      }
    }
  });
//Show trang tin tuc
function showNewsHomePage(len = 3, sameViews = false) {
  fetch("/asset/json/news.json")
    .then((res) => res.json())
    .then((news) => {
      if (sameViews)
        news = news.filter(
          (item) => item.id != window.location.search.slice(4)
        );
      if (news.length > len) news.length = len;
      const HTML__NEWS = news
        .map((newItem) => {
          const { id, date, name, des, avata } = newItem;
          return ` <div class="news__item col-lg-4 col-6">
            <a class="news__item--link__container" href="/tin-tuc-chi-tiet?id=${id}">
                <figure>
                    <div class="news__item--box__avata">
                        <img src="${avata}" alt="${name}">
                    </div>
                    <figcaption>
                        <h4 class="news__item--title"><a href=/tin-tuc-chi-tiet?id=${id}">Cách làm ${name} siêu thơm ngon tại nhà</a></h4>
                        <p class="news__item--des">${des}</p>
                    </figcaption>
                    <div class="overlay_news">

                    </div>
                    <div class="news__item---open">
                    ${date}
                    </div>
                </figure>
            </a>

            <div class="news__item--seeall">
                <a href="/new?id=${id}">Xem Thêm ...</a>
            </div>
        </div>`;
        })
        .join("");
      $$("#news").innerHTML = HTML__NEWS;
    });
}
function fetchBanner() {
  fetch(URL_BANNER)
    .then((res) => res.json())
    .then((banners) => {
      // show banner sliders
      const HTML_BANNER = banners
        .map(
          (banner, index) => `<figure>
            <img class="slider" src="${banner}"  alt="Slider ${index} - HT Bakery">
        </figure>
        `
        )
        .join("");
      $$(".banner_sliders").innerHTML = HTML_BANNER;

      const lengthBanner = banners.length;
      // button sliders
      let HTML_BTN_BANNER = "";
      for (const i in banners) {
        HTML_BTN_BANNER += ` <button class="btn_banner ${
          i == 0 ? "active" : ""
        }"></button>`;
      }
      $$(".presentation__sliders").innerHTML = HTML_BTN_BANNER;
      banner_sliders(lengthBanner);
    });
}

// Banner slider
const banner_sliders = (lengthBanner = 0) => {
  const btn_left = $$(".btn_silder_left");
  const btn_right = $$(".btn_silder_right");
  const slider_buttons = $$l(".presentation__sliders button");
  const timeSlide = 6000;
  let slider_id_change = setTimeout(() => {
    btn_right.click();
  }, timeSlide);
  const banners = {
    isIndex: 0,
    autoplaySpeed: timeSlide,
    setBannerActive(index) {
      slider_buttons[this.isIndex].classList.remove("active");
      slider_buttons[index].classList.add("active");
      this.isIndex = index;
      clearTimeout(slider_id_change);
      slider_id_change = setTimeout(() => {
        btn_right.click();
      }, this.autoplaySpeed);
    },
  };

  $(document).ready(function () {
    $(".banner_sliders").slick({
      dots: true,
      speed: 1000,
    });
    const stickDots = $$l(".slick-dots li");

    // banner slider left right button
    btn_left.onclick = () => {
      $$(".slick-prev").click();
      const index_current_pre = banners.isIndex - 1;
      banners.setBannerActive(
        index_current_pre < 0 ? lengthBanner - 1 : index_current_pre
      );
    };
    btn_right.onclick = () => {
      $$(".slick-next").click();
      const index_current = banners.isIndex + 1;
      banners.setBannerActive(
        index_current >= lengthBanner ? 0 : index_current
      );
    };
    // banner slider with  index button
    slider_buttons.forEach((buttonSlider, index) => {
      buttonSlider.onclick = () => {
        stickDots[index].click();
        banners.setBannerActive(index);
      };
    });
  });
};

//show product at home
async function showProductsViewHome(
  lenProduct = 4,
  kind = 1,
  sameViews = false
) {
  const res__products = await fetch(API_PRODUCTS);
  const data = (API = await res__products.json());
  const res__kind = await fetch(API_KIND);
  const kinds = (await res__kind.json()) || [];

  if (kinds?.length <= 0) return;

  const { title } = kinds.find((item) => item.id == kind) ?? false;
  if (!title) return false;
  if (lenProduct <= 0) return;

  let dataBakery = data.filter((bakery) => bakery.kind === kind);
  if (sameViews)
    dataBakery = dataBakery.filter(
      (item) => item.id != window.location.search.slice(4)
    );
  if (lenProduct < dataBakery.length) dataBakery.length = lenProduct;
  const loveHearts = hearts.show();

  const HTML_BAKERY = dataBakery
    .map((item) => {
      const { id, name, avatar, priceSale, priceOrigin, size, slug } = item;
      return `<div class="product-content col-lg-3 col-md-4 col-6">
    <figure class="product__item--des">
        <a href="/product/${slug}" class="product__item--avata">
            <img  loading="lazy" src="${avatar}" alt="${name}">
        </a>
        <figcaption>
            <h3 class="product__item--title"><a href="/product/${slug}">${name}</a></h3>
            <div class="product__item--price">${coverPrice(
              priceSale
            )} đ <del class="price--del">${
        priceOrigin > priceSale ? coverPrice(priceOrigin) + " đ" : ""
      }</del>
            </div>
            <div class="product__item--size">${
              size == "fullsize" ? "S, M, L" : size
            }</div>
        </figcaption>
        <div data-id="${id}" class="product-item--stickers__love ${
        loveHearts.find((item) => item.id == id) ? "hidden" : ""
      }">
            <i class="fa-regular fa-heart"></i>
            <span class="stickers--des">Thêm vào yêu thích</span>
        </div>
        <div class="product-item--stickers__del ${
          percentReduce(priceOrigin, priceSale) || "hidden"
        }">
            -${percentReduce(priceOrigin, priceSale)}%
        </div>
        <div class="product-item--buttons d-md-block d-none">
            <div onclick="openViews(${id})"  class="product-item__btn product-item--button__show">
                <div class="item__btn--view"> Xem nhanh</div>
                <div class="item__btn--view item__btn--sub_view"><i
                        class="fa-regular fa-eye"></i></div>
            </div>
            <div class="product-item__btn product-item--button__buy">
                <div class="item__btn--view" data-id="${id}"> Mua Hàng</div>
                <div data-id="${id}" class="item__btn--view item__btn--sub_view addcart">
                    <i data-id="${id}" class="fa-solid fa-cart-plus"></i>
                </div>
            </div>
        </div>
        <div class="product-item--buttons__mobiles d-md-none d-flex">
            <div onclick="openViews(${id})" class="item__btn--view"><i class="fa-regular fa-eye"></i></div>
            <div class="item__btn--view addcart" data-id="${id}"><i data-id="${id}" class="fa-solid fa-cart-plus"></i></div>
        </div>

    </figure>
</div>`;
    })
    .join("");

  const products__kind = `
    <div class="products__container--shows">
        <div class="products__container">
            <div class="products__kind">
                <h2 class="products__kind--title">${title}</h2>
            </div>
            <div class="row product__item">
                ${HTML_BAKERY}
             </div>
             <div class="button__green products__container--seeall">
                <a href="categories/banh-my-banh-ngot${kind}">Xem Thêm</a>
            </div>
         </div>
    </div>
    `;
  const container = $$("#show__products");
  if (container.innerHTML) {
    container.insertAdjacentHTML("beforeend", products__kind);
  } else container.innerHTML = products__kind;

  return kinds;
}
// xem sản phẩm views
function openViews(id) {
  const product = API.find((item) => item.id == id);
  showProductModal(product);
}

//xừ lý giỏ hàng Cart;
function HandleCart() {
  const list__btn_adds = $$l(".item__btn--view.addcart");
  const btn__close = $$("#modal__cart .modal__head--close");
  // Dóng mở modal
  modal__container_cart.addEventListener("click", () => {
    modal__container_cart.classList.add("hidden");
  });
  $$("#modal__cart .modal__body--content").addEventListener("click", (e) => {
    e.stopPropagation();
  });

  btn__close.addEventListener("click", (e) => {
    modal__container_cart.classList.add("hidden");
  });
  list__btn_adds.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      const kind = API.find((item) => item.id == id).kind;
      showKind(kind);
      if (carts.check(id)) {
        carts.update(id, 1);
      } else {
        carts.add(API.find((item) => item.id == id));
      }
      showCart();
      modal__container_cart.classList.remove("hidden");
    });
  });
  showCart();
}

//
$$(".btn_close--menu").onclick = () => {
  $$("#openmenu").click();
};
// turn off modal
$$(".modal__dialog--close").onclick = () => {
  $$(".modal__dialog").classList.add("hidden");
};
$$(".header__menu--right.header-heart").onclick = () => {
  $$(".modal__hearts").classList.remove("hidden");
  handleHearts();
};
// xử lý giỏ hang yeu thich
function handleHearts() {
  const btn__loves = $$l(".product-item--stickers__love");
  const totalHeartElement = $$(".header__products-like__count");
  btn__loves.forEach((btnHeart) => {
    btnHeart.onclick = () => {
      const id = btnHeart.getAttribute("data-id");
      hearts.add(API.find((item) => item.id == id));
      totalHeartElement.innerText = hearts.show().length;
      btnHeart.classList.add("hidden");
    };
  });
  $$("#heart__container").innerHTML =
    hearts
      .show()
      .map((item) => {
        const { name, avatar, priceSale, id, slug } = item;
        return `<div class="modal__body--product">
        <a href="/product/${slug}" class="modal__body--product__avata">
            <img src="${avatar}" alt="${name}">
        </a>
        <div class="modal__body--product__des" id="heart__container">
            <h3 class="product__des--title pb-2"><a href="/product/${slug}">${name}</a></h3>
            <p class="product__des--price">${coverPrice(
              priceSale
            )}<span>₫</span></p>
            <div class="button__green">
                <a href="/product/${slug}">Chi Tiết</a>
            </div>
        </div>
        <div data-id="${id}" class="modal__hearts--close"> 
        <i class="fa-solid fa-xmark"></i>
    </div>
    </div>`;
      })
      .join("") || "Chưa có sản phẩm yêu thích nào";
  totalHeartElement.innerText = hearts.show().length;
  $$(".modal__hearts .modal__head--close").onclick = () => {
    $$(".modal__hearts").classList.add("hidden");
  };
  $$(".modal__hearts").onclick = () => {
    $$(".modal__hearts").classList.add("hidden");
  };
  $$(".modal__hearts .modal__body--content").onclick = (e) => {
    e.stopPropagation();
  };

  $$l(".modal__hearts .modal__hearts--close").forEach((btnClose) => {
    btnClose.onclick = () => {
      const id = btnClose.getAttribute("data-id");
      const parentHeartBox = btnClose.closest(".modal__body--product");
      parentHeartBox.classList.add("hidden");
      hearts.delete(id);

      Array.from($$l(".product-item--stickers__love"))
        .find((item) => item.getAttribute("data-id") == id)
        ?.classList.remove("hidden");

      totalHeartElement.innerText = hearts.show().length;
    };
  });
}
$$("#cartBag").onclick = () => {
  showKind(1);
  modal__container_cart.classList.remove("hidden");
  HandleCart();
};
const inputList = Array.from($$l(".form--group input"));
if (inputList.length != 0) {
  inputList.forEach((input) => {
    input.onblur = () => {
      handleInput(input, " không được để trống !", 4);
    };
    input.oninput = () => {
      handleInput(input, " không được để trống !");
    };
  });
}
// form login
const account = createStorage("user");

formLogin();
function formLogin() {
  const formContainer = account.get("username")
    ? ".modal__userlog"
    : ".modal__userRegister";
  const modal__log = document.querySelector(formContainer);
  const btn__close = modal__log.querySelector(".modal__head--close");
  const userlog__container = modal__log.querySelector(".userlog__container");
  const listInput = modal__log.querySelectorAll(".form__input");
  const listInputError = [
    ...modal__log.querySelectorAll(".form__input--error"),
  ];
  const form = modal__log.querySelector("form");

  $$(".btn--login").onclick = () => {
    openModal(modal__log);
  };
  btn__close.onclick = () => {
    closeModal(modal__log);
    removeInputErrorAll(listInput);
  };
  userlog__container.onclick = (e) => {
    e.stopPropagation();
  };
  modal__log.onclick = () => {
    closeModal(modal__log);
    removeInputErrorAll(listInput);
  };
  form.onsubmit = (e) => {
    e.preventDefault();
    checkInputSubmit(listInput);
    const submit = listInputError.some((m) => m.textContent.trim());

    if (!submit) {
      const listValueInput = modal__log.querySelectorAll("input");
      const [username, passsword] = listValueInput;
      const tk = username.value;
      const mk = passsword.value;

      switch (modal__log.dataset.type) {
        case "login":
          console.log(tk, mk);
          $.post(
            "/user/login",
            {
              method: "post login",
              data: {
                username: tk,
                password: mk,
                token: localStorage.getItem("_token"),
              },
            },
            (response) => {
              console.log(response);
              if (response.status == 403) {
                handleInput($$("#username"), response.message, "error");
              } else if (response.status == 201) {
                handleInput($$("#password"), response.message, "error");
              } else {
                localStorage.setItem("permission", response.account.permission);
                account.add("permission", response.account.permission);
                account.add("username", response.account.username);
                localStorage.setItem("_token", response.account.accessToken);
                alert(response.message);
                window.location.reload();
              }
            }
          );

          break;
        case "register":
          $.post(
            "/user/register",
            {
              method: "post Register",
              data: {
                username: tk,
                password: mk,
                permission: "member",
              },
            },
            (response) => {
              console.log(response);
              if (response.status == 200) {
                localStorage.setItem("_token", response.accessToken);
                localStorage.setItem("permission", response.account.permission);
                account.add("username", username.value);
                account.add("permission", response.account.permission);
                alert(response.message);
                window.location.reload();
              } else {
                handleInput($$("#res_username"), response.message, "error");
              }
            }
          );

          break;
      }
    }
  };
}
$$(".btn_loginnow").onclick = () => {
  closeModal($$(".modal__userRegister"));
  openModal($$(".modal__userlog"));
  account.add("username", "dsadsa");
  formLogin();
};
function removeInputErrorAll(listInput) {
  listInput.forEach((inputBox) => {
    const input = inputBox.querySelector("input");
    if (inputBox.classList.contains("error")) {
      inputBox.classList.remove("error");
      input.value = "";
      inputBox.querySelector(".form__input--error").textContent = "";
    }
    if (input.value) {
      input.value = "";
    }
  });
}
function checkInputSubmit(listInput = []) {
  listInput.forEach((groupInput) => {
    const input = groupInput.querySelector("input");
    if (!input.value) {
      groupInput.classList.add("error");
      groupInput.querySelector(
        ".form__input--error"
      ).textContent = `Trường ${input.dataset.name} không được để trống!`;
    } else if (input.value.length <= 4) {
      groupInput.classList.add("error");
      groupInput.querySelector(
        ".form__input--error"
      ).textContent = `Trường ${input.dataset.name} phải lớn hơn 4 ký tự !`;
    }
  });
}
function closeModal(modalParent) {
  modalParent.classList.add("hidden");
}
function openModal(modalParent) {
  modalParent.classList.remove("hidden");
}

function handleInput(input, message = "", len = 0) {
  const parentInput = input.closest(".form--group");
  const form__input = parentInput.querySelector(".form__input");
  const messageElement = parentInput.querySelector(".form__input--error");
  if (len == "error") {
    form__input.classList.add("error");
    messageElement.innerHTML = `Trường ${input.dataset.name + message} `;
    return;
  }
  if (!input.value) {
    form__input.classList.add("error");
    messageElement.innerHTML = `Trường ${input.dataset.name + message} `;
    return false;
  } else {
    if (input.value.length <= len) {
      form__input.classList.add("error");
      messageElement.innerHTML = `Trường ${input.dataset.name} phải lớn hơn ${len} ký tự`;
      return false;
    }
    form__input.classList.remove("error");
    messageElement.innerHTML = ``;
    return true;
  }
}
// Display sản phẩm
function showCart() {
  const CartProductsBox = $$(".modal__body--product__list");
  const listCartItems = carts.show();
  let total = 0;
  totalCart.innerText = listCartItems.length;
  const HTML__CART = listCartItems
    .map((cart) => {
      const { id, name, avatar, priceSale, amount, slug } = cart;
      total += priceSale * amount;
      return `<div class="modal__body--product">
        <a href="/product/${slug}" class="modal__body--product__avata">
            <img loading="lazy" src="${avatar}" alt="${name}">
        </a>
        <div class="modal__body--product__des">
            <h3 class="product__des--title pb-2"><a href="/product/${slug}">${name}</a></h3>
            <p class="product__des--price">${coverPrice(
              priceSale
            )} đ x <span class="product__des--amount"> ${amount}</span></p>
            <div class="product__des--controller">
                <button data-id=${id} data-type="decrease" class="handleAmounts"><i class="${
        amount >= 2 ? "fa-solid fa-minus" : "fa-solid fa-trash-can"
      }"></i></button>
                <input class="product__des--controller__amount" type="number" value="${amount}">
                <button data-id=${id} data-type="increase" class="handleAmounts"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>
    </div>`;
    })
    .join("");
  if (HTML__CART) CartProductsBox.innerHTML = HTML__CART;
  else CartProductsBox.innerHTML = `Chưa có sản phẩm `;
  $$(".total__cart").innerText = coverPrice(total);
  controllerCartProducts();
}
function showKind(kind = 1, len = 3) {
  const listProductKinds = API.filter((item) => item.kind == kind);
  if (len < listProductKinds.length) listProductKinds.length = len;
  $$(".modal__body__add--listporduct").innerHTML = listProductKinds
    .map((item) => {
      const { id, name, avatar, priceSale, slug } = item;
      const link = `/product/${slug}`;
      return `<div class="modal__body--product">
        <a href="${link}" class="modal__body--product__avata">
            <img src="${avatar}" alt="">
        </a>
        <div class="modal__body--product__des">
            <h3 class="product__des--title pb-2"><a href="${link}">${name}</a></h3>
            <p class="product__des--price">${coverPrice(
              priceSale
            )}<span>₫</span></p>
            <div class="button__green">
                <a href="${link}">Chi Tiết</a>
            </div>
        </div>
    </div>`;
    })
    .join("");
}
// Điều chỉnh sử lý tăng giảm số lượng sản phẩm trong giỏ hàng;
function controllerCartProducts() {
  const listBtnHandleAmounts = $$l(".handleAmounts");
  listBtnHandleAmounts.forEach((item) => {
    item.onclick = () => {
      const parentBox = item.closest(".modal__body--product");
      const id = item.getAttribute("data-id");
      const typeButton = item.getAttribute("data-type");
      let amount = carts.getItem(id)?.amount ?? 1;
      let totalAmount = amount;
      let totalProduct = coverNumber(totalBox.innerText) / 1000;
      const priceSale = Number(
        API.find((product) => product.id == id).priceSale
      );

      if (typeButton == "increase") {
        totalProduct += priceSale;
        ++amount;
        const test = parentBox.querySelector("i.fa-trash-can");
        if (test) {
          test.className = `fa-solid fa-minus`;
        }
        if (amount > 10) return false;
      } else {
        totalProduct -= priceSale;
        --amount;
        if (amount == 1) {
          item.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        }
        if (amount <= 0) {
          totalCart.innerText = Number(totalCart.innerText) - 1;
          carts.delete(id);
          parentBox.classList.add("hidden");
          totalBox.innerHTML = coverPrice(totalProduct);
          return true;
        }
      }

      carts.update(id, amount - totalAmount);
      parentBox.querySelector(".product__des--amount").innerText = amount;
      parentBox.querySelector(".product__des--controller__amount").value =
        amount;
      totalBox.innerHTML = coverPrice(totalProduct);
    };
  });
}

// Serach sản phẩm

$$(".btn--open-search").addEventListener("click", showModalSearch);
$$(".btn__find--search").addEventListener("click", showModalSearch);

function showModalSearch() {
  const modal__search = $$("#modal__search");
  const searchInput = $$("#search--input");
  modal__search.classList.remove("hidden");
  modal__search.onclick = () => {
    modal__search.classList.add("hidden");
  };
  $$(".modal__search").onclick = () => {
    closeModal(modal__search);
    searchInput.value = "";
  };
  $$(".btn--close-search").onclick = () => {
    closeModal(modal__search);
    searchInput.value = "";
  };
  $$("#modal__search .modal__body--content").onclick = (e) => {
    e.stopPropagation();
  };
  $$("#modal__search .modal__body").innerHTML = `Chưa có sản phẩm`;
  searchInput.focus();
  searchInput.addEventListener("input", (e) => {
    let value = e.target.value.trim().toLowerCase();
    let listItemsSearch = [];
    listItemsSearch = API.filter(
      ({ name, des }) =>
        name.toLowerCase().includes(value) || des.toLowerCase().includes(value)
    );
    if (listItemsSearch?.length >= 5) {
      listItemsSearch.length = 5;
    }
    if (listItemsSearch.length > 0) {
      $$("#modal__search .modal__body").innerHTML = listItemsSearch
        .map((item) => {
          const { id, priceSale, name, avatar, slug } = item;
          return `<div class="modal__body--product">
                <a href="/product/${slug}" class="modal__body--product__avata">
                    <img src="${avatar}" alt="${name}">
                </a>
                <div class="modal__body--product__des" id="heart__container">
                    <h3 class="product__des--title pb-2"><a href="http://">${name}</a></h3>
                    <p class="product__des--price">${coverPrice(
                      priceSale
                    )}<span>₫</span></p>
                    <div class="button__green">
                        <a href="/product/${slug}">Chi Tiết</a>
                    </div>
                </div>
                <div data-id="${id}" class="modal__hearts--close"> 
                <i class="fa-solid fa-xmark"></i>
            </div>
            </div>`;
        })
        .join("");
      $$l("#modal__search .modal__hearts--close").forEach((btnClose) => {
        btnClose.onclick = () => {
          const parentHeartBox = btnClose.closest(".modal__body--product");
          parentHeartBox.classList.add("hidden");
        };
      });
    } else
      $$("#modal__search .modal__body").innerHTML = `Sản phẩm không tồn tại !`;
  });
}
showListCategori();
async function showListCategori() {
  const res__kind = await fetch(API_KIND);

  const kinds = await res__kind.json();
  const html__categoris = kinds
    .map((cate) => {
      return ` <li><a href="/categories/${cate.slug}">${cate.title}</a></li>`;
    })
    .join("");
  $$l("ul.sub__nav").forEach((ul) => (ul.innerHTML = html__categoris));
}
// format number đạng 100.000
const coverPrice = (number) => {
  if (!Number(number)) return 0;
  return new Intl.NumberFormat().format(number * 1000);
};
const coverNumber = (price) => {
  if (price.includes(",")) {
    price = price.replaceAll(",", "");
  }
  if (price.includes(".")) {
    price = price.replaceAll(".", "");
  }
  if (price.includes(" đ")) {
    price = price.replaceAll(" đ", "");
  }
  return Number(price);
};

// xử lý %
const percentReduce = (a, b) => {
  if (b >= a) return false;
  return ((1 - b / a) * 100).toFixed(2);
};
