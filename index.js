//Örnek ürün verileri
let products = [
    /* {id: 1, name: "ürün1", price: 50, unitsInStock: 10, categoryId: 1, active: true},
     {id: 2, name: "ürün2", price: 500, unitsInStock: 110, categoryId: 1, active: true},
     {id: 3, name: "ürün3", price: 5000, unitsInStock: 5, categoryId: 2, active: false},
     // Diğer ürünleri ekleyebilirsiniz*/
];

const jwtToken = localStorage.getItem('jwtToken');
const customerId = localStorage.getItem('customerId');

//sepet içeriği
let cartItems = [];

// ürün listesini oluştur.
function renderProductList() {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach(product => {
        if (product.active) {
            const productCard = document.createElement("div");
            productCard.classList.add("col-md-6", "mb-4");

            // İmage elementini oluştur
            const productImage = document.createElement("img");
            productImage.src = `C:\\Users\\hasan.demircan\\Desktop\\e-commerce\\${product.image}`;
            productImage.alt = product.name;
            productImage.style.maxWidth = "50px";
            productImage.style.maxHeight = "50px";

            // Diğer ürün bilgilerini içeren card içeriğini oluştur
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            cardBody.innerHTML = `
                <h5 class="card-title"> ${product.name} </h5>
                <p class="card-text"> Fiyat: ${product.price}</p>
                <button class="btn btn-primary" onclick="addToCart(${product.id})"> Sepete Ekle </button>
            `;

            // Image ve card içeriğini productCard'a ekle
            productCard.appendChild(productImage);
            productCard.appendChild(cardBody);

            // productCard'ı productList'e ekle
            productList.appendChild(productCard);
        }
    });
}

document.addEventListener('DOMContentLoaded', async function () {

    // Kategori seçimini dinle
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.addEventListener('change', function () {
        const selectedCategoryId = categorySelect.value;
        fetchProductsByCategory(selectedCategoryId);
    });

    // Ürünleri ve kategorileri getir
    await fetchCategories();
    await fetchProductsByCategory(categorySelect.value);

    // Satın al butonunu dinle
    document.getElementById('buyButton').addEventListener('click', function () {
        // Satın alma işlemi
        alert('Satın alma işleminiz başarıyla tamamlandı!');
        // Siparişi backend'e gönderme işlemi burada gerçekleştirilebilir

        // Sipariş verildikten sonra sepeti temizle
        clearCart();
        // Satın al butonunun görünürlüğünü güncelle
        updateBuyButtonVisiblitiy();
    });

    // Sayfa yüklendiğinde çağrılacak fonksiyonlar
    renderProductList();
    updateCart();
    updateBuyButtonVisiblitiy();
});

// Kategorileri getirme fonksiyonu
async function fetchCategories() {
    const categoriesUrl = 'http://localhost:8080/category';
    try {
        const response = await fetch(categoriesUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            }
        });
        if (!response.ok) {
            throw new Error('Başarısız durum kodu: ' + response.status);
        }
        const data = await response.json();
        displayCategories(data);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Kategorileri sayfada gösterme fonksiyonu
function displayCategories(categories) {
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.innerHTML = ''; // Önceki kategorileri temizle

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Ürünleri kategoriye göre getirme fonksiyonu
async function fetchProductsByCategory(categoryId) {
    const endpointUrl = 'http://localhost:8080/product/category/' + categoryId;
    try {
        const response = await fetch(endpointUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            }
        });
        if (!response.ok) {
            throw new Error('Başarısız durum kodu: ' + response.status);
        }

        const data = await response.json();
        products = data;
        renderProductList();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

//sepete ürün ekle
function addToCart(productId) {
    const productToAdd = products.find(product => product.id === productId);
    if (productToAdd && productToAdd.unitsInStock > 0) {
        cartItems.push({ id: productToAdd.id, name: productToAdd.name, price: productToAdd.price })
        productToAdd.unitsInStock--; // stoktan düş, çünkü ben sepetime eklediysem ve 1 tane varsa başkası alamasın.
        updateCart();
        updateBuyButtonVisiblitiy();
    }
}

function updateCart() {
    const cart = document.getElementById("cart");
    cart.innerHTML = ""; //temizle

    //sepet içeriğini göster
    cartItems.forEach((item, index) => {
        const cartItemElement = document.createElement("li")
        cartItemElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        const itemNameElement = document.createElement("span")
        cartItemElement.textContent = `${item.name} - Fiyat: ${item.price}`;
        const deleteButton = document.createElement("button")
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
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
    const removedItem = cartItems.splice(index, 1)[0];
    //ürün stoğunu artır
    const product = products.find(p => p.id === removedItem.id);
    console.log("silinen ürün " + product)
    if (product) {
        product.unitsInStock++;
    }
    updateCart();
    updateBuyButtonVisiblitiy();
}

function updateBuyButtonVisiblitiy() {
    const buyButton = document.getElementById("buyButton");

    //Eğer sepet boşsa "Satın Al" butonunu gizle, doluysa göster
    if (cartItems.length === 0) {
        buyButton.style.display = 'none';
    } else {
        buyButton.style.display = 'block'
    }
}

//Satın Al (buyButton) tıklama olayını(event/function) ekle.
//istersen buyButton id'li html'e git ve onclick=functionName ekleyerek buraya function ekle.
document.getElementById("buyButton").addEventListener('click', function () {
    //Burada satın alma işlemini gerçekleştireceğiz.
    //yani backende istek atacaz, cartItems içerisinde bulunan ürünleri
    alert("Satın alma işleminiz başarıyla tamamlandı!")

    // Create a map to store counts
    const idCountMap = new Map();

    // Iterate through the cartItems array
    cartItems.forEach(item => {
        const { id } = item;

        // Check if the id exists in the map
        if (idCountMap.has(id)) {
            // If it exists, increment the count
            idCountMap.set(id, idCountMap.get(id) + 1);
        } else {
            // If it doesn't exist, set the count to 1
            idCountMap.set(id, 1);
        }
    });

    // Display the id and count mapping
    idCountMap.forEach((count, id) => {
        console.log(`ID: ${id}, Count: ${count}`);
    });
    var orderProductInfoList = [...idCountMap].map(([productId, quantity]) => ({ productId, quantity }));
    console.log("map to List -> " + orderProductInfoList)


    //kullanıcı sipariş ver dedğinde backend api ye istek atar
    fetch('http://localhost:8080/order', {
        method: 'POST',
        body: JSON.stringify({
            customerId,
            orderProductInfoList
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: 'Bearer ' + jwtToken
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(' isteğiaşarısız. Durum kodu:' + response.status);
            }
            return response.json();
        })
        .then((data) => {

        })
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
document.addEventListener("DOMContentLoaded", async () => {
    //await getProductListByApi();

    renderProductList();
    updateCart();
    updateBuyButtonVisiblitiy();
})

