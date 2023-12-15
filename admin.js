//örnek ürün verileri, ileride backende bağlıcaz
let products = [
    /*  { id: 1, name: "ürün1", price: 50, unitsInStock: 10, categoryId: 1, image: "mini.jpg", active: true },
      { id: 2, name: "ürün2", price: 500, unitsInStock: 110, categoryId: 1, image: "mini.jpg", active: true },
      { id: 3, name: "ürün3", price: 5000, unitsInStock: 5, categoryId: 2, image: "mini.jpg", active: false },*/
    // Diğer ürünleri ekleyebilirsiniz
];

const jwtToken = localStorage.getItem('jwtToken');

// yeni ürün eklemek için modal görünümünü göster ve verileri al
async function addProduct() {
    const fileInput = document.getElementById('productImage');
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productUnitsInStock = document.getElementById('productUnitsInStock').value;
    const productCategoryId = document.getElementById('productCategoryId').value;
    const productActive = document.getElementById('productActive').checked;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const productData = {
        name: productName,
        price: productPrice,
        unitsInStock: productUnitsInStock,
        categoryId: productCategoryId,
        active: productActive
    };

    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

    await fetch('http://localhost:8080/product/save', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Başarılı sonuç

        })
        .catch(error => {
            // Hata durumu
            console.error('Error:', error);
        });
    // Backend'e POST isteği gönder.
    // products.push(newProduct);
    getAllProduct();
    resetAddProductForm(); // Modal formunu sıfırla.
    //backende istek at
    $('#addProductModal').modal('hide'); // Modal'ı kapat.
}

//product tablosunu güncellemek için
async function renderProductTable() {

    const productTableBody = document.getElementById("productTableBody");
    productTableBody.innerHTML = "";

    products.forEach(product => {

        const row = productTableBody.insertRow();
        row.innerHTML = `
        <td> ${product.name} </td>
        <td> ${product.price} </td>
        <td> ${product.unitsInStock} </td>
        <td> ${product.categoryId} </td>
        <td><img src="/Users/hasankadirdemircan/Desktop/e-commerce/${product.image}" alt="${product.name}" style="max-width: 50px; ax-height: 50px;"> </td>
        <td> ${product.active ? 'Yes' : 'No'} </td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Güncelle</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Sil</button>
        </td>    
      `;
    });
}
async function getAllProduct() {

    try {
        const response = await fetch('http://localhost:8080/product/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        products = await response.json();
        await renderProductTable(); // Yeni ürünü tabloya ekleyerek güncelle.


    } catch (error) {
        console.error('Error:', error.message);
    }

}

// Ürünü silmek için
function deleteProduct(productId) {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (confirmed) {
        // Silme işlemi burada gerçekleştirilebilir.
        fetch('http://localhost:8080/product/' + productId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            },
        })
            .then(response => {
                if (response.ok) {
                    // Başarılı ise tabloyu güncelle

                    products = products.filter(product => product.id !== productId);
                    renderProductTable();
                } else {
                    // Başarısız ise hata mesajını logla
                    console.error('Error:', response.status);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
}
function resetAddProductForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productUnitsInStock").value = "";
    document.getElementById("productCategoryId").value = "";
    document.getElementById("productActive").checked = false;
    document.getElementById("productImage").value = "";
}
// Düzenleme modalını kapatmak için
function closeEditProductModal() {
    const editProductModal = new bootstrap.Modal(document.getElementById("editProductModal"));
    editProductModal.hide();
}

//Ürünü düzenlemek için modal görünümünü göster ve veri güncelle
function editProduct(productId) {
    const selectedProduct = products.find(product => product.id === productId);

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

    const editedProductId = parseInt(document.getElementById("editProductId").value);
    const editedProductName = document.getElementById("editProductName").value;
    const editedProductPrice = document.getElementById("editProductPrice").value;
    const editedProductUnitsInStock = document.getElementById("editProductUnitsInStock").value;
    const editedProductCategoryId = document.getElementById("editProductCategoryId").value;
    const editedProductActive = document.getElementById("editProductActive").checked;

    //Görsel seçimi için input elementini al
    const editedImageInput = document.getElementById("editProductImage");

    const productData = {
        id: editedProductId,
        name: editedProductName,
        price: editedProductPrice,
        unitsInStock: editedProductUnitsInStock,
        categoryId: editedProductCategoryId,
        active: editedProductActive,
        image: products.find(product => product.id === editedProductId).image
    };

    const formData = new FormData();
    formData.append('file', feditedSelectedImage = editedImageInput.files[0]);
    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

    fetch('http://localhost:8080/product/update', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Başarılı sonuç
            console.log(data);
        })
        .catch(error => {
            // Hata durumu
            console.error('Error:', error);
        });
    // Edit modalı kapat
    $('#editProductModal').modal('hide');

    closeEditProductModal();
    //  $('#editProductModal').modal('hide'); // Modal'ı kapat.
}

// Sayfa yüklendiğinde çağrılacak fonksiyonlar
document.addEventListener("DOMContentLoaded", async () => {
    await getAllProduct();
    renderProductTable();
})


