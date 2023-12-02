function submitForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log("username: " + username);
    console.log("password: " + password);

    fetch('http://localhost:8080/customer/getToken', {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Login isteğiaşarısız. Durum kodu:' + response.status);
            }
            return response.json();
        })
        .then((data) => {
            console.log('login istek başarılı: ', data);

            //    alert('Gönder başarıyla oluşturuldu.')

            // postForm.reset();
        })
}