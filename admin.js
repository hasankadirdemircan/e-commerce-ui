//örnek ürün verileri, ileride backende bağlıcaz
let products = [
     {id: 1, name: "ürün1", price: 50, unitsInStock: 10, categoryId: 1, image:"C://Users/hasan.demircan/Desktop/e-commerce-ui/mini.jpg", active: true},
     {id: 2, name: "ürün2", price: 500, unitsInStock: 110, categoryId: 1, image:"C://Users/hasan.demircan/Desktop/e-commerce-ui/mini.jpg", active: true},
     {id: 3, name: "ürün3", price: 5000, unitsInStock: 5, categoryId: 2, image:"C://Users/hasan.demircan/Desktop/e-commerce-ui/mini.jpg", active: false},
     // Diğer ürünleri ekleyebilirsiniz
 ];


 // yeni ürün eklemek için modal görünümünü göster ve verileri al
 function addProduct() {
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productUnitsInStock  = document.getElementById("productUnitsInStock ").value;
    const productCategoryId  = document.getElementById("productCategoryId ").value;
    const productActive  = document.getElementById("productActive ").value;
   
    //image
    const productImage  = document.getElementById("productImage ").value;
    const selectedImage = productImage.files[0];

    //yeni ürün oluştur
    const newProduct = {
        id : products.length + 1, // backende istek atarken bu olmayacak. backend kendisi id koyuyor
        name: productName,
        price: productPrice,
        unitsInStock: productUnitsInStock,
        categoryId: productCategoryId,
        image: selectedImage,
        active: productActive
    };

    //backende POST isteği at.
    products.push(newProduct);
    renderProductTable(); // yukarda yeni product eklediğimiz için tekrar form'a bas.
    resetAddProductForm(); //add modal içeriği tekrar dolu değil boş gelmesi için
 }

 //product tablosunu güncellemek için
 function renderProductTable() {
    const productTableBody = document.getElementById("productTableBody");
    productTableBody.innerHTML = "";

    products.forEach(product => {
        const row = productTableBody.insertRow();
        row.innerHTML = `
        <td> ${product.name} </td>
        <td> ${product.price} </td>
        <td> ${product.unitsInStock} </td>
        <td> ${product.categoryId} </td>
        <td><img src="${product.image}" alt="${product.name}" style="max-width: 50px; ax-height: 50px;"> </td>
        <td> ${product.active ?  'Yes' : 'No'} </td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Güncelle</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Sil</button>
        </td>    
      `;
    });
 }

 //Ürünü düzenlemek için modal görünümünü göster ve veri güncelle
 function editProduct(productId) {
    const selectedProduct = products.find( product => product.id === productId);

    document.getElementById("editProductId").value = selectedProduct.id;
    document.getElementById("editProductName").value = selectedProduct.name;
    document.getElementById("editProductPrice").value = selectedProduct.price;
    document.getElementById("editProductUnitsInStock").value = selectedProduct.unitsInStock;
    document.getElementById("editProductCategoryId").value = selectedProduct.categoryId;
    document.getElementById("editProductActive").checked = selectedProduct.active;

    const editProductModal = new bootstrap.Modal(document.getElementById("editProductModal"));
    editProductModal.show();
 }

 //Düzenlenmiş ürünü kaydetmek için 
function saveEditedProduct() {
    debugger
    const editedProductId = parseInt(document.getElementById("editProductId").value);
    const editedProductName = document.getElementById("editProductName").value;
    const editedProductPrice = document.getElementById("editProductPrice").value;
    const editedProductUnitsInStock = document.getElementById("editProductUnitsInStock").value;
    const editedProductCategoryId = document.getElementById("editProductCategoryId").value;
    const editedProductActive = document.getElementById("editProductActive").checked;

    //Görsel seçimi için input elementini al
    const editedImageInput = document.getElementById("editProductImage");

    //seçilen image'i al
    let editedSelectedImage = editedImageInput.files[0];
    if(editedSelectedImage === undefined) {
        const product = products.find(product => product.id === editedProductId);
        editedSelectedImage =  product.image;
    }
    //seçili ürünü güncelle
    products = products.map(product => {
        if (product.id === editedProductId) {
            return {
                id: editedProductId,
                name: editedProductName,
                price: editedProductPrice,
                unitsInStock: editedProductUnitsInStock,
                categoryId: editedProductCategoryId,
                image: editedSelectedImage,
                active: editedProductActive
            };
        } else {
            return product;
        }
    });
    
    console.log(products)    
    renderProductTable();
    //closeEditProcutModal();
}

 
// Sayfa yüklendiğinde çağrılacak fonksiyonlar
document.addEventListener("DOMContentLoaded", async () => {
    renderProductTable();
})


