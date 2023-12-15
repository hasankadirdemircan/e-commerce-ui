// category.js dosyası
const jwtToken = localStorage.getItem('jwtToken');
// Tabloyu güncelleme fonksiyonu
function updateTable() {
    fetch('http://localhost:8080/category', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwtToken
        }
    })
        .then(response => response.json())
        .then(data => {
            var tableBody = document.getElementById('categoryTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';

            data.forEach(function (category) {
                var row = "<tr>" +
                    "<td>" + category.id + "</td>" +
                    "<td>" + category.name + "</td>" +
                    "<td>" +
                    "<button type='button' class='btn btn-info' data-toggle='modal' data-target='#editModal' onclick='openEditModal(" + category.id + ")'>Edit</button> | " +
                    "<button type='button' class='btn btn-danger' onclick='deleteCategory(" + category.id + ")'>Delete</button>" +
                    "</td>" +
                    "</tr>";

                tableBody.innerHTML += row;
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // Sayfa yüklendiğinde tüm kategorileri getir
    updateTable();

    // Form submit olayı
    document.getElementById('addCategoryBtn').addEventListener('click', function () {
        // Form verilerini al
        var name = document.getElementById('name').value;

        // Fetch API ile veriyi backend'e gönder
        fetch('http://localhost:8080/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            },
            body: JSON.stringify({ name: name }),
        })
            .then(response => response.json())
            .then(() => {
                // Formu temizle
                document.getElementById('name').value = '';

                // Tabloyu güncelle
                updateTable();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});
// Düzenleme modalını açma fonksiyonu
function openEditModal(id) {
    // Modal'ı açmadan önce mevcut kategori bilgilerini al
    fetch('http://localhost:8080/category/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwtToken
        }
    })
        .then(response => response.json())
        .then(category => {
            // Modal içindeki formu doldur
            document.getElementById('editCategoryId').value = category.id;
            document.getElementById('editCategoryName').value = category.name;

            // Modal'ı aç
            $('#editModal').modal('show');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Düzenleme işlemi için fonksiyon
function editCategory() {
    var id = document.getElementById('editCategoryId').value;
    var newName = document.getElementById('editCategoryName').value;

    // Fetch API ile veriyi backend'e gönder
    fetch('http://localhost:8080/category', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwtToken
        },
        body: JSON.stringify({ id: id, name: newName }),
    })
        .then(response => response.json())
        .then(() => {
            // Modal'ı kapat
            $('#editModal').modal('hide');

            // Tabloyu güncelle
            updateTable();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Silme fonksiyonu
// Silme fonksiyonu
function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        // Fetch API ile veriyi backend'e gönder
        fetch('http://localhost:8080/category/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            },
        })
            .then(response => {
                if (response.ok) {
                    // Başarılı ise tabloyu güncelle
                    updateTable();
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

