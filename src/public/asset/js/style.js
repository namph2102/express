

// xuất ra sản phẩm showProductsViewHome(Độ dài sản phẩm,Loại sản phẩm )

showHomePage();

async function showHomePage(){
    fetchBanner();
    await showProductsViewHome(4,1);
    await showProductsViewHome(4,2);
    HandleCart();
    handleHearts();
    showNewsHomePage(3);
}




