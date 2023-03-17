const login = document.getElementById('login');
login.addEventListener('submit', onSubmit);
const email = document.getElementById('email');
const password = document.getElementById('password');

function onSubmit(e) {
    e.preventDefault();

    loginObject = {
        email: email.value,
        password: password.value
    }

    axios.post('http://localhost:4000/user/login', loginObject)
        .then((response) => {
            alert(response.data.message);
        })
        .catch((err) => {
            console.log(err);
            document.body.innerHTML += err + `<button onclick="window.location.href = '../html/login.html'">Reload</button>`
        });
}