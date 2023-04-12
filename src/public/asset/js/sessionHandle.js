function createStorage(key) {
  const store = JSON.parse(localStorage.getItem(key)) ?? {};
  const save = () => {
    localStorage.setItem(key, JSON.stringify(store));
  };
  const storage = {
    show() {
      return store;
    },
    get(key) {
      return store[key];
    },
    add(key, value) {
      store[key] = value;
      save();
    },
    delete(key) {
      delete store[key];
      save();
    },
  };
  return storage;
}
function createStoreList(key, obj = true) {
  const storeList = JSON.parse(localStorage.getItem(key)) ?? [];
  const save = () => {
    localStorage.setItem(key, JSON.stringify(storeList));
  };
  // kiem tra id co ton tai hay khong
  const check = (id) => storeList.some((item) => item.id == id);
  return {
    show() {
      return storeList;
    },
    getItem(id) {
      return storeList.find((item) => item.id == id);
    },
    add(product, amount = 1, size = "S") {
      if (!check(product.id)) {
        if (obj) {
          const { id, name, avatar, priceSale, priceOrigin, kind, slug, _id } =
            product;
          storeList.push({
            id,
            _id,
            name,
            avatar,
            priceSale,
            priceOrigin,
            slug,
            amount,
            size,
            kind,
          });
        } else {
          const { id, name, avatar, priceSale, slug } = product;
          storeList.push({ id, name, avatar, slug, priceSale });
        }
      }
      save();
    },
    check(id) {
      return check(id);
    },
    update(id, amout, size) {
      if (storeList.some((item) => item.id == id)) {
        let item = storeList.find((item) => item.id == id);
        if (size) {
          item.size = size;
        }
        if (amout) {
          let value = Number(item.amount) + Number(amout);
          item.amount = value >= 10 ? 10 : value;
        }
      }
      save();
    },
    delete(id) {
      check(id) &&
        storeList.splice(storeList.findIndex((item) => item.id == id).id, 1);

      save();
    },
  };
}
