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
                throw new Error('Login isteği başarısız. Durum kodu:' + response.status);
            }
            return response.json();
        })
        .then((data) => {
            console.log('login istek başarılı: ', data);
            console.log('customerId : ' + data.customerId)
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('customerId', data.customerId);

           // console.log("localstorage")
           // console.log(localStorage.getItem('jwtToken'))
          const role = parseJwt(data.token);
          if("ROLE_USER" === role) {
            window.location.href = "index.html";
          } else if ("ROLE_ADMIN" === role) {
            window.location.href = "admin.html";
          }
        })
}


function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = JSON.parse(atob(base64));

    const userRole = decodedData.authorities[0].authority;
    console.log(userRole);
    return userRole;
}
