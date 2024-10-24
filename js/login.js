document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://localhost:7069/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        window.location.href = '/index.html'; // Redirige a la página principal
    } else {
        document.getElementById('errorMessage').textContent = data.message || 'Usuario o contraseña incorrectos';
    }
});