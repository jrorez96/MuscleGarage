document.addEventListener("DOMContentLoaded", () => {
    const productoSelect = document.getElementById("producto");
    const tipoPagoSelect = document.getElementById("tipoPago");
    const cantidadInput = document.getElementById("cantidad");
    const precioInput = document.getElementById("precio");
    const fechaInput = document.getElementById("fecha");

    // Variable para almacenar los productos con precios
    let productos = [];

    // Cargar productos desde la API
    fetch('https://www.musclegarage.somee.com/Productos') // Reemplaza con la URL de tu API
        .then(response => response.json())
        .then(data => {
            productos = data; // Guardar los productos
            data.forEach(producto => {
                const option = document.createElement("option");
                option.value = producto.nombre;
                option.textContent = producto.nombre;
                productoSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));

    // Cargar tipos de pago desde la API
    fetch('https://www.musclegarage.somee.com/TipoPago') // Reemplaza con la URL de tu API
        .then(response => response.json())
        .then(data => {
            data.forEach(tipoPago => {
                const option = document.createElement("option");
                option.value = tipoPago.nombre;
                option.textContent = tipoPago.nombre;
                tipoPagoSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar tipos de pago:", error));

    // Actualizar precio total al cambiar cantidad o producto
    function actualizarPrecio() {
        const productoSeleccionado = productos.find(producto => producto.nombre === productoSelect.value);
        if (productoSeleccionado) {
            const precioUnitario = productoSeleccionado.precio;
            const cantidad = parseInt(cantidadInput.value) || 0;
            const precioTotal = precioUnitario * cantidad;
            precioInput.value = precioTotal.toFixed(2); // Mostrar precio con dos decimales
        } else {
            precioInput.value = ""; // Limpiar precio si no hay producto seleccionado
        }
    }

    // Escuchar cambios en cantidad y producto
    cantidadInput.addEventListener("input", actualizarPrecio);
    productoSelect.addEventListener("change", actualizarPrecio);

    // Agregar venta
    document.getElementById('agregar-venta').addEventListener('click', () => {
        const productoSeleccionado = productoSelect.value;
        const tipoPago = tipoPagoSelect.value;
        const cantidad = cantidadInput.value;
        const precioTotal = precioInput.value;
        const fecha = fechaInput.value;

        if (!productoSeleccionado || !tipoPago || !cantidad || !precioTotal || !fecha) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const ventaData = {
            nombre: productoSeleccionado,
            tipoPago,
            cantidad: parseInt(cantidad),
            precio: parseFloat(precioTotal),
            fecha
        };

        console.log(JSON.stringify(ventaData)); // Verificar qué se está enviando

        fetch('https://www.musclegarage.somee.com/VentaProducto', { // Reemplaza con la URL de tu API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
        })
        .then(response => {
            if (response.ok) {
                alert("Venta registrada exitosamente");
                // Reiniciar formulario
                productoSelect.value = "";
                tipoPagoSelect.value = "";
                cantidadInput.value = "";
                precioInput.value = "";
                fechaInput.value = "";
                window.location.href = 'listaVentaProducto.html'; // Redirección
            } else {
                alert("Venta registrada exitosamente");
                window.location.href = 'listaVentaProducto.html'; // Redirección
            }
        })
        .catch(error => console.error("Error al agregar la venta:", error));
    });
});
