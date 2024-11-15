document.addEventListener("DOMContentLoaded", () => {
    // Cargar productos desde la API
    fetch('https://www.musclegarage.somee.com/Productos') // Reemplaza con la URL de tu API
        .then(response => response.json())
        .then(data => {
            const productoSelect = document.getElementById('producto');
            data.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.nombre;
                option.textContent = producto.nombre;
                productoSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar productos:', error));

    // Cargar tipos de pago desde la API
    fetch('https://www.musclegarage.somee.com/TipoPago') // Reemplaza con la URL de tu API
        .then(response => response.json())
        .then(data => {
            const tipoPagoSelect = document.getElementById('tipoPago');
            data.forEach(tipoPago => {
                const option = document.createElement('option');
                option.value = tipoPago.nombre;
                option.textContent = tipoPago.nombre;
                tipoPagoSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar tipos de pago:', error));

    // Agregar venta
    document.getElementById('agregar-venta').addEventListener('click', () => {
        const nombre = document.getElementById('producto').value;
        const tipoPago = document.getElementById('tipoPago').value;
        const cantidad = document.getElementById('cantidad').value;
        const precio = document.getElementById('precio').value;

        if (!producto || !tipoPago || !cantidad || !precio) {
            alert('Todos los campos son obligatorios');
            return;
        }

        const ventaData = {
            nombre,
            tipoPago,
            cantidad,
            precio
        };

        console.log(JSON.stringify(ventaData)); // Verificar qué se está enviando

        fetch('https://www.musclegarage.somee.com/VentaProducto', { // Reemplaza con la URL de tu API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
        })
        .then(response => response.json())
        .then(data => {
            alert('Venta registrada exitosamente');
        })
        .catch(error => console.error('Error al agregar la venta:', error));
        window.location.href = 'listaVentaProducto.html'; // Redirección al index.html
    });
});
