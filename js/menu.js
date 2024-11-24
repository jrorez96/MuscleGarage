document.addEventListener("DOMContentLoaded", () => {
    // Cargar el menú desde menu.html
    fetch("menu.html")
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar el menú.");
            return response.text();
        })
        .then(html => {
            document.getElementById("menu-container").innerHTML = html;

            // Mostrar el nombre de usuario desde localStorage
            const username = localStorage.getItem("usuario");
            if (username) {
                document.getElementById("username-display").textContent = `(${username})`;
            }
        })
        .catch(error => console.error("Error:", error));
});