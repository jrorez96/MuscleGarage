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

            // Ocultar enlaces específicos si el usuario es "test"
            if (username === "Dalthon" || username === "Jeffry") {
                const productosLink = document.getElementById("productos-link");
                const membresiasLink = document.getElementById("membresias-link");

                if (productosLink) {
                    productosLink.style.display = "none";
                }

                if (membresiasLink) {
                    membresiasLink.style.display = "none";
                }
            }
        })
        .catch(error => console.error("Error:", error));
});
