//Örnek ürün verileri
const products = [
    {id: 1, name: "ürün1", price: 50, unitsInStock: 10, categoryId: 1, active: true},
    {id: 2, name: "ürün2", price: 500, unitsInStock: 110, categoryId: 1, active: true},
    {id: 3, name: "ürün3", price: 5000, unitsInStock: 5, categoryId: 2, active: false},
    // Diğer ürünleri ekleyebilirsiniz
];

//sepet içeriği
let cartItems = [];

// ürün listesini oluştur.
function renderProductList() {

    const productList = document.getElementById("productList")
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("col-md-6", "mb-4");
        productCard.innerHTML=  ` 
        <div class="card">
            <div class="card-body">
                <h5 class="card-title"> ${product.name} </h5>
                <p class="card-text"> Fiyat: ${product.price}</p>
                <button class="btn btn-primary" onclick="addToCart(${product.id})"> Sepete Ekle </button>
            </div>
        </div>
        `;
        productList.appendChild(productCard);
    });
}

//sepete ürün ekle
function addToCart(productId) {
    const productToAdd = products.find(product => product.id === productId);
    if(productToAdd) {
        cartItems.push({id: productToAdd.id, name:productToAdd.name, price: productToAdd.price})
        updateCart();
    }
}

function updateCart() {
    const cart = document.getElementById("cart");
    cart.innerHTML=""; //temizle

    //sepet içeriğini göster
    cartItems.forEach(item => {
        const cartItemElement = document.createElement("li")
        cartItemElement.classList.add("list-group-item");
        cartItemElement.textContent = `${item.name} - Fiyat: ${item.price}`;

        cart.appendChild(cartItemElement);
    })
}
// Sayfa yüklendiğinde çağrılacak fonksiyonlar
document.addEventListener("DOMContentLoaded", () => {
    renderProductList();
    updateCart();
})

