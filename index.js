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
    if(productToAdd && productToAdd.unitsInStock > 0) {
        cartItems.push({id: productToAdd.id, name:productToAdd.name, price: productToAdd.price})
        productToAdd.unitsInStock--; // stoktan düş, çünkü ben sepetime eklediysem ve 1 tane varsa başkası alamasın.
        updateCart();
        updateBuyButtonVisiblitiy();
    }
}

function updateCart() {
    const cart = document.getElementById("cart");
    cart.innerHTML=""; //temizle

    //sepet içeriğini göster
    cartItems.forEach((item, index) => {
        const cartItemElement = document.createElement("li")
        cartItemElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        
        const itemNameElement = document.createElement("span")
        cartItemElement.textContent = `${item.name} - Fiyat: ${item.price}`;
        const deleteButton = document.createElement("button")
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.innerHTML= '<i class="bi bi-trash"></i>';
        deleteButton.onclick = function () {
            removeFromCart(index);
        };

        cartItemElement.appendChild(itemNameElement);
        cartItemElement.appendChild(deleteButton);
        cart.appendChild(cartItemElement);
    })
}

//Sepetten ürün çıkar
function removeFromCart(index) {
    debugger
    const removedItem = cartItems.splice(index, 1)[0];
    //ürün stoğunu artır
    const product = products.find(p => p.id === removedItem.id);
    console.log("silinen ürün " + product)
    if(product) {
        product.unitsInStock++;
    }
    updateCart();
    updateBuyButtonVisiblitiy();
}

function updateBuyButtonVisiblitiy() {
    const buyButton = document.getElementById("buyButton");

    //Eğer sepet boşsa "Satın Al" butonunu gizle, doluysa göster
    if(cartItems.length === 0) {
        buyButton.style.display = 'none';
    } else {
        buyButton.style.display = 'block'
    }
}

//Satın Al (buyButton) tıklama olayını(event/function) ekle.
//istersen buyButton id'li html'e git ve onclick=functionName ekleyerek buraya function ekle.
document.getElementById("buyButton").addEventListener('click', function() {
    //Burada satın alma işlemini gerçekleştireceğiz.
    //yani backende istek atacaz, cartItems içerisinde bulunan ürünleri
    alert("Satın alma işleminiz başarıyla tamamlandı!")
    //istersen burada satın aldıktan sonra başka sayfayada yönlendirebilirsin.
    console.log(cartItems)
    clearCart();
    //Satın al butonunun görünürlüğünü güncelle
    updateBuyButtonVisiblitiy();
})

function clearCart() {
    cartItems = [];
    updateCart();
}
// Sayfa yüklendiğinde çağrılacak fonksiyonlar
document.addEventListener("DOMContentLoaded", () => {
    renderProductList();
    updateCart();
    updateBuyButtonVisiblitiy();
})

