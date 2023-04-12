displayProduct();
async function displayProduct() {
  const lenProduct = 12;
  const res = await showProductsViewHome(lenProduct, kind);
  console.log(res);
  const kindItem = res.find((item) => item.id == kind);
  $$(".navigation__box").innerHTML = `<li><a href="/home">Trang chủ /</a></li>
  <li><a href="/categories/${kindItem.slug}">${kindItem.title}</a></li>
`;
  HandleCart();
  handleHearts();
}
