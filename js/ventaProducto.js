document.addEventListener("DOMContentLoaded", () => {
    fetchSalesData();
});

async function fetchSalesData() {
    try {
        const response = await fetch("https://www.musclegarage.somee.com/VentaProducto"); // Reemplaza con la URL de tu API
        const data = await response.json();
        
        console.log(data); // Verifica la estructura de los datos

        const productList = document.getElementById("product-list");

        if (Array.isArray(data)) {
            // Si data es un array, itera sobre cada elemento
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${item.nombre}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${item.tipoPago}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${item.cantidad}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${item.monto}</td>
                `;
                productList.appendChild(row);
            });
        } else {
            // Si data es un solo objeto
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${data.nombre}</td>
                <td class="px-6 py-4 whitespace-nowrap">${data.tipoPago}</td>
                <td class="px-6 py-4 whitespace-nowrap">${data.cantidad}</td>
                <td class="px-6 py-4 whitespace-nowrap">${data.monto}</td>
            `;
            productList.appendChild(row);
        }
    } catch (error) {
        console.error("Error al obtener las ventas de productos:", error);
    }
}
