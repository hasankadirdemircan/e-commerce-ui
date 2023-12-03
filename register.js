function register() {
    //form verilerini al
    const formData = {
        email: document.getElementById('email').value,
        firstName: document.getElementById('firstName').value,
        surname: document.getElementById('surname').value,
        password: document.getElementById('password').value,
        address: {
            country: document.getElementById('country').value,
            city: document.getElementById('city').value,
            district: document.getElementById('district').value,
            addressLine: document.getElementById('addressLine').value,
            postCode: document.getElementById('postCode').value
        }
    };

    console.log('form datası çekilde: ', formData)
    //TODO: API'ye Post atmam lazım

    fetch('http://localhost:8080/customer/addCustomer', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("response for register : ", data)
        window.location.href = "login.html"
    })
    .catch(error => {
        console.error("Error", error)
    })
}