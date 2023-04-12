productDetail();
async function productDetail() {
  const id = window.location.search.slice(4) || 1;
  const slug = window.location.pathname.split("/")[2];
  const res__products = await fetch(API_PRODUCTS);
  const API = await res__products.json();
  const res__kind = await fetch(API_KIND);
  const kinds = await res__kind.json();

  const item = API.find((item) => {
    return item.slug === slug;
  });
  $$(".product__status").innerHTML = item.status ? "Còn hàng" : "Hết hàng";
  $$(".product__material").innerHTML = item.material.join(", ");
  $$(".product__price").innerHTML = coverPrice(item.priceSale) + "đ";
  $$(".image__avata").src = item.avatar;
  $$(".product__detail--footer_des").innerHTML = item.des;
  const container = document.querySelector(".navigation__box");
  const kind = kinds.find((kind) => kind.id == item.kind);
  const html = ` <li class="product__navition--kind"> <a href="">${kind.title}</a> /</li>  <li class="product__navition--name"> <a href="">${item.name}</a> </li>`;
  container.insertAdjacentHTML("beforeend", html);
  $$(".product__des--name").innerHTML = item.name;
  $$(".product__navition--name").innerHTML = item.name;
  $$(".product__buying").onclick = () => {
    if (carts.check(id)) {
      carts.update(id, 1);
    } else {
      carts.add(item);
    }
    showKind(item.kind);
    HandleCart();
    $$("#modal__cart").classList.remove("hidden");
  };
  await showProductsViewHome(4, item.kind, true);
  $$(".products__kind--title").innerHTML = "Sản phẩm tương tự";

  HandleCart();
  handleHearts();
}
