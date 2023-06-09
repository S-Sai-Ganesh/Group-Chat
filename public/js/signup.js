const signup = document.getElementById('signup');
signup.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();

    let signupObject = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        number: document.getElementById('number').value
    };

    axios
        .post('http://3.239.162.206:4000/user/signup', signupObject)
        .then((response) => {
            console.log(response.data.message);
            alert(response.data.message);
            window.location.href = "../html/login.html";
        })
        .catch((err) => {
            console.log(err);
            document.body.innerHTML += err + `<button onclick="window.location.href = '../html/signup.html'">Reload</button>`
        });
}