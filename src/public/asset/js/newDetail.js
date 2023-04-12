(async function () {
  const res = await fetch("/asset/json/news.json");
  const news = await res.json();
  const id = window.location.search.slice(4) || 1;

  const item = news.find((item) => item.id == id);
  console.log(item);
  if (item) {
    const title = "Cách làm " + item.name;
    $$(".new__detail--title").textContent = title + " siêu ngon tại nhà";
    $$(".new__detail--des__make").textContent = item.des;
    $$(".new__detail--des__time").textContent =
      item.date +
      "/" +
      new Date(Date.now()).getFullYear() +
      " - Chế biến bánh thơm ngon";

    $$(".new__detail--avata").src = item.avata;
    $$("#material").innerHTML = item.material
      .map((m) => `<li>- ${m}</li>`)
      .join("");
    $$("#steps").innerHTML = item.steps.map((m) => `<li>${m}</li>`).join("");
    $$(".navigation__box").insertAdjacentHTML(
      "afterend",
      `<li><a href="" class="text_link">${item.name}</a></li>`
    );
  }
})();
async function contactPage() {
  await showProductsViewHome(0, 1);
  HandleCart();
  handleHearts();
  showNewsHomePage(3, true);
}
contactPage();
