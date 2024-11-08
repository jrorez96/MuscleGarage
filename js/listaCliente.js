const apiUrl = 'https://www.musclegarage.somee.com/Clientes';
let clients = [];  // Aquí se almacenarán los clientes

// Función para abrir el pop-up de pago
function openPaymentPopup(cedula) {
    const paymentPopup = document.getElementById('payment-popup');
    const paymentFormCedula = document.getElementById('payment-cedula');
    paymentFormCedula.value = cedula;
    paymentPopup.style.display = 'block'; // Mostrar el pop-up
}

// Función para enviar el pago
async function submitPayment() {
    const cedula = document.getElementById('payment-cedula').value;
    const FechaDePago = document.getElementById('payment-date').value;

    // Depuración: Verifica el valor de la fecha antes de enviar
    console.log("Fecha de pago:", FechaDePago);
    if (!FechaDePago) {
        alert("Por favor ingresa una fecha de pago.");
        return;
    }

    const apiPaymentUrl = `https://www.musclegarage.somee.com/Pagos`;  // Ajusta la URL según tu API
    const paymentData = {
        cedula: cedula,
        FechaDePago: FechaDePago,
    };

    try {
        const response = await fetch(apiPaymentUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });
        if (response.ok) {
            console.log('Pago enviado correctamente');
            closePaymentPopup();
            window.location.href = 'index.html'; // Redirección al index.html
        } else {
            console.error('Error al enviar el pago');
        }
    } catch (error) {
        console.error('Error al enviar el pago:', error);
    }
}

// Función para cerrar el pop-up de pago
function closePaymentPopup() {
    const paymentPopup = document.getElementById('payment-popup');
    paymentPopup.style.display = 'none'; // Ocultar el pop-up
}

// Función para eliminar un cliente
async function deleteClient(cedula) {
    const apiDeleteUrl = `${apiUrl}/${cedula}`;
    try {
        const response = await fetch(apiDeleteUrl, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error en la eliminación del cliente');
        }

        // Suponiendo que el API devuelve un mensaje en formato JSON
        const data = await response.json();
        alert(data.message);  // Muestra el mensaje de éxito del servidor

        // Actualizar la lista de clientes y renderizar nuevamente
        clients = clients.filter(client => client.cedula !== cedula);
        window.location.href = 'index.html'; // Redirección al index.html
        //renderClients();

    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        alert('Error al eliminar el cliente: ' + error.message);
    }
}


// Función para abrir el pop-up de edición de cliente
function openEditClientPopup(cedula) {
    const client = clients.find(c => c.cedula === cedula);  // Buscar el cliente por su cédula
    if (client) {
        const editPopup = document.getElementById('edit-client-popup');
        document.getElementById('edit-cedula').value = client.cedula;
        document.getElementById('edit-nombre').value = client.nombre;
        document.getElementById('edit-telefono').value = client.telefono;
        document.getElementById('edit-correo').value = client.correo;
        document.getElementById('edit-membresia').value = client.membresia;  // Asignar la membresía
        document.getElementById('edit-fecha-inicio').value = new Date(client.fechaInicio).toISOString().split('T')[0];  // Asignar la fecha de inicio
        editPopup.style.display = 'block'; // Mostrar el pop-up
    } else {
        console.error('Cliente no encontrado');
    }
}

// Función para cerrar el pop-up de edición
function closeEditClientPopup() {
    const editPopup = document.getElementById('edit-client-popup');
    editPopup.style.display = 'none'; // Ocultar el pop-up
}

// Función para guardar los cambios del formulario de edición
document.getElementById('edit-client-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const cedula = document.getElementById('edit-cedula').value;
    const nombre = document.getElementById('edit-nombre').value;
    const telefono = document.getElementById('edit-telefono').value;
    const correo = document.getElementById('edit-correo').value;
    const membresia = document.getElementById('edit-membresia').value;
    const fechaInicio = document.getElementById('edit-fecha-inicio').value;

    const updatedClient = {
        cedula,
        nombre,
        telefono,
        correo,
        membresia,
        fechaInicio
    };

    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedClient),
        });

        if (response.ok) {
            console.log('Cliente actualizado correctamente');
            closeEditClientPopup();
            window.location.href = 'index.html'; // Redirección al index.html
        } else {
            console.error('Error al actualizar el cliente');
        }
    } catch (error) {
        console.error('Error en la solicitud a la API', error);
    }
});

// Evento para cargar los clientes al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const clientList = document.getElementById('client-list');
    const searchClientInput = document.getElementById('search-client');
    const clientsPerPage = 10;  // Número de clientes por página
    let currentPage = 1;

    // Función para hacer la consulta al API
    async function fetchClients() {
        try {
            const response = await fetch(apiUrl);
            clients = await response.json();
            renderClients();
        } catch (error) {
            console.error('Error al consultar los clientes:', error);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Función para mostrar los clientes en la página actual
    function renderClients() {
        const start = (currentPage - 1) * clientsPerPage;
        const end = start + clientsPerPage;
        const filteredClients = clients.filter(client => {
            const searchTerm = searchClientInput.value.toLowerCase();
            return client.nombre.toLowerCase().includes(searchTerm) || 
                   client.cedula.toLowerCase().includes(searchTerm) ||
                   client.correo.toLowerCase().includes(searchTerm);
        });
        
        const paginatedClients = filteredClients.slice(start, end);

        // Limpiar la lista de clientes antes de renderizar
        clientList.innerHTML = '';

        // Renderizar cada cliente en la tabla
        paginatedClients.forEach(client => {
            const fechaInicioC = client.fechaInicio ? formatDate(client.fechaInicio) : 'Sin fecha';
            const fechaFinC = client.fechaFin ? formatDate(client.fechaFin) : 'Sin fecha';
            const tr = document.createElement('tr');

            // Insertar los datos del cliente en la tabla
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${client.cedula}</td>
                <td class="px-6 py-4 whitespace-nowrap">${client.nombre}</td>
                <td class="px-6 py-4 whitespace-nowrap">${client.telefono}</td>
                <td class="px-6 py-4 whitespace-nowrap">${client.correo}</td>
                <td class="px-6 py-4 whitespace-nowrap">${client.membresia}</td>
                <td class="px-6 py-4 whitespace-nowrap">${fechaInicioC}</td>
                <td class="px-6 py-4 whitespace-nowrap">${fechaFinC}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${getStatusStyle(client.estado)}">${client.estado}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap"></td>
            `;

            const buttonContainer = tr.lastElementChild;

            // Botón Editar
            const editButton = document.createElement('button');
            editButton.classList.add('bg-yellow-500', 'text-white', 'py-1', 'px-2', 'rounded', 'hover:bg-yellow-700');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => openEditClientPopup(client.cedula));

            // Botón Eliminar
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('bg-red-500', 'text-white', 'py-1', 'px-2', 'rounded', 'hover:bg-red-700');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => deleteClient(client.cedula));

            // Botón Pagar
            const paymentButton = document.createElement('button');
            paymentButton.classList.add('bg-green-500', 'text-white', 'py-1', 'px-2', 'rounded', 'hover:bg-green-700');
            paymentButton.textContent = 'Pagar';
            paymentButton.addEventListener('click', () => openPaymentPopup(client.cedula));

            // Agregar botones al contenedor
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(paymentButton);

            clientList.appendChild(tr);
        });

        // Opcional: Crear controles de paginación
        createPagination(filteredClients.length);
    }

    // Función para aplicar estilos según el estado
    function getStatusStyle(status) {
        if (status === 'ACTIVO') {
            return 'bg-green-100 text-green-800 px-2 py-1 rounded-full';
        } else if (status === 'VENCIDO') {
            return 'bg-red-100 text-red-800 px-2 py-1 rounded-full';
        }
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full';  // Estado por defecto
    }

    // Función para crear los controles de paginación
    function createPagination(totalClients) {
        const totalPages = Math.ceil(totalClients / clientsPerPage);
        const paginationContainer = document.getElementById('pagination');

        paginationContainer.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('px-4', 'py-2', 'mx-1', 'bg-blue-500', 'text-white', 'rounded');
            if (i === currentPage) {
                button.classList.add('bg-blue-700');
            }

            button.addEventListener('click', () => {
                currentPage = i;
                renderClients();
            });

            paginationContainer.appendChild(button);
        }
    }

    document.getElementById('payment-form').addEventListener('submit', async function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario
        submitPayment(); // Llamada a la función de envío de pago
    });

    // Función para filtrar clientes conforme se escribe en el buscador
    searchClientInput.addEventListener('input', () => {
        currentPage = 1;  // Reiniciar a la primera página al buscar
        renderClients();
    });

    // Llamar a la función para obtener los clientes cuando la página carga
    fetchClients();
});
