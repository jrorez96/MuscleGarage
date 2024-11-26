const apiUrl = 'https://www.musclegarage.somee.com/Clientes';
const apiMembershipsUrl = 'https://www.musclegarage.somee.com/Membresias'; // URL del API para obtener membresías
let clients = [];  // Aquí se almacenarán los clientes

const currentUser = localStorage.getItem('usuario'); // Ajusta esta clave según tu implementación 

// Función para abrir el pop-up de pago
async function openPaymentPopup(cedula) {
    const paymentPopup = document.getElementById('payment-popup');
    const paymentFormCedula = document.getElementById('payment-cedula');
    const paymentMembershipSelect = document.getElementById('payment-membresia');
    paymentFormCedula.value = cedula;

    try {
        // Obtener datos del cliente seleccionado
        const client = clients.find(c => c.cedula === cedula);
        if (!client) {
            alert('Cliente no encontrado.');
            return;
        }

        // Obtener las membresías desde el API
        const response = await fetch(apiMembershipsUrl);
        const memberships = await response.json();

        // Limpiar opciones previas y agregar nuevas
        paymentMembershipSelect.innerHTML = '';
        memberships.forEach(membership => {
            const option = document.createElement('option');
            option.value = membership.nombre;
            option.textContent = membership.nombre;
            if (membership.nombre === client.membresia) {
                option.selected = true; // Seleccionar la membresía actual
            }
            paymentMembershipSelect.appendChild(option);
        });

        paymentPopup.style.display = 'block'; // Mostrar el pop-up
    } catch (error) {
        console.error('Error al obtener las membresías:', error);
        alert('No se pudieron cargar las membresías.');
    }
}

// Función para enviar el pago
async function submitPayment() {
    const cedula = document.getElementById('payment-cedula').value;
    const FechaDePago = document.getElementById('payment-date').value;
    const Membresia = document.getElementById('payment-membresia').value;

    if (!FechaDePago) {
        alert("Por favor ingresa una fecha de pago.");
        return;
    }

    const apiPaymentUrl = `https://www.musclegarage.somee.com/Pagos`;
    const paymentData = { cedula, FechaDePago, Membresia };

    try {
        const response = await fetch(apiPaymentUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });
        if (response.ok) {
            console.log('Pago enviado correctamente');
            closePaymentPopup();
            window.location.href = 'index.html';
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
        const response = await fetch(apiDeleteUrl, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error en la eliminación del cliente');
        
        const data = await response.json();
        alert(data.message);
        clients = clients.filter(client => client.cedula !== cedula);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        alert('Error al eliminar el cliente: ' + error.message);
    }
}

// Función para abrir el pop-up de edición de cliente
async function openEditClientPopup(cedula) {
    const client = clients.find(c => c.cedula === cedula);
    if (client) {
        const editPopup = document.getElementById('edit-client-popup');
        document.getElementById('edit-cedula').value = client.cedula;
        document.getElementById('edit-nombre').value = client.nombre;
        document.getElementById('edit-telefono').value = client.telefono;
        document.getElementById('edit-correo').value = client.correo;
        document.getElementById('edit-fecha-inicio').value = new Date(client.fechaInicio).toISOString().split('T')[0];

        try {
            // Llamada al API para obtener las membresías
            const response = await fetch(apiMembershipsUrl);
            const memberships = await response.json();

            const membershipSelect = document.getElementById('edit-membresia');
            membershipSelect.innerHTML = ''; // Limpiar opciones previas

            // Agregar cada membresía al select
            memberships.forEach(membership => {
                const option = document.createElement('option');
                option.value = membership.nombre; // Usamos el nombre como valor
                option.textContent = membership.nombre;
                if (membership.nombre === client.membresia) { // Comparación con la membresía actual
                    option.selected = true;
                }
                membershipSelect.appendChild(option);
            });

            editPopup.style.display = 'block';
        } catch (error) {
            console.error('Error al obtener las membresías:', error);
        }
    } else {
        console.error('Cliente no encontrado');
    }
}

// Función para cerrar el pop-up de edición
function closeEditClientPopup() {
    const editPopup = document.getElementById('edit-client-popup');
    editPopup.style.display = 'none';
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

    const updatedClient = { cedula, nombre, telefono, correo, membresia, fechaInicio };

    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedClient),
        });

        if (response.ok) {
            console.log('Cliente actualizado correctamente');
            closeEditClientPopup();
            window.location.href = 'index.html';
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
    const clientsPerPage = 10;
    let currentPage = 1;

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
        clientList.innerHTML = '';

        paginatedClients.forEach(client => {
            const fechaInicioC = client.fechaInicio ? formatDate(client.fechaInicio) : 'Sin fecha';
            const fechaFinC = client.fechaFin ? formatDate(client.fechaFin) : 'Sin fecha';
            const tr = document.createElement('tr');

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

            const editButton = document.createElement('button');
            editButton.classList.add('bg-yellow-500', 'text-white', 'py-1', 'px-2', 'rounded', 'hover:bg-yellow-700');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => openEditClientPopup(client.cedula));

            const paymentButton = document.createElement('button');
            paymentButton.classList.add('bg-green-500', 'text-white', 'py-1', 'px-2', 'rounded', 'hover:bg-green-700');
            paymentButton.textContent = 'Pagar';
            paymentButton.addEventListener('click', () => openPaymentPopup(client.cedula));

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(paymentButton);

            // Agregar botón de eliminar solo si el usuario no es "test"
            if (currentUser !== 'Dalthon' && currentUser !== 'Jeffry') {
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('bg-red-500', 'text-white', 'py-1', 'px-2', 'rounded', 'hover:bg-red-700');
                deleteButton.textContent = 'Eliminar';
                deleteButton.addEventListener('click', () => deleteClient(client.cedula));
                buttonContainer.appendChild(deleteButton);
            }

            clientList.appendChild(tr);
        });

        createPagination(filteredClients.length);
    }

    function getStatusStyle(status) {
        if (status === 'ACTIVO') {
            return 'bg-green-100 text-green-800 px-2 py-1 rounded-full';
        } else if (status === 'VENCIDO') {
            return 'bg-red-100 text-red-800 px-2 py-1 rounded-full';
        }
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full';
    }

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

    searchClientInput.addEventListener('input', () => {
        currentPage = 1;
        renderClients();
    });

    fetchClients();
});
