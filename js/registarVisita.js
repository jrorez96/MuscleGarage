// URL del API para obtener clientes
const apiUrl = 'http://www.musclegarage.somee.com/Clientes';  // Cambia esto según tu API

// Elementos del DOM
const searchInput = document.getElementById('search-client');
const resultados = document.getElementById('resultados');
const clientList = document.getElementById('client-list');
const modal = document.getElementById('modal');
const clientInfo = document.getElementById('client-info');
const closeModal = document.getElementById('close-modal');
let clientes = [];  // Clientes que se obtendrán del API

// Función para obtener los clientes desde el API
async function fetchClients() {
    try {
        const response = await fetch(apiUrl);
        clientes = await response.json();  // Asumimos que el API devuelve un array de clientes
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
    }
}

// Filtrar clientes al escribir en el buscador
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredClients = clientes.filter(client =>
        client.nombre.toLowerCase().includes(searchTerm)
    );

    // Mostrar u ocultar la lista según los resultados
    if (filteredClients.length > 0 && searchTerm !== '') {
        clientList.classList.remove('hidden');
        displayClients(filteredClients);
    } else {
        clientList.classList.add('hidden');
    }
});

// Mostrar los clientes filtrados
function displayClients(clientes) {
    resultados.innerHTML = '';
    clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.textContent = cliente.nombre;
        li.classList.add('py-2', 'cursor-pointer', 'hover:bg-gray-100');
        li.addEventListener('click', () => showClientInfo(cliente));
        resultados.appendChild(li);
    });
}

// Mostrar la información del cliente en el modal con botones según el estado
function showClientInfo(cliente) {
    clientInfo.innerHTML = `
        <p>Nombre: ${cliente.nombre}</p>
        <p>Membresía: ${cliente.membresia}</p>
        <p>Estado: ${cliente.estado}</p>
    `;
    
    // Botones dinámicos según el estado
    const actionButton = document.createElement('button');
    actionButton.classList.add('bg-blue-500', 'text-white', 'py-2', 'px-4', 'rounded', 'mt-4');

    if (cliente.estado === 'ACTIVO') {
        actionButton.textContent = 'Registrar Visita';
        actionButton.addEventListener('click', () => registerVisit(cliente.cedula));
    } else if (cliente.estado === 'VENCIDO') {
        actionButton.textContent = 'Pagar';
        actionButton.addEventListener('click', () => payMembership(cliente.cedula));
    }

    clientInfo.appendChild(actionButton);
    modal.classList.remove('hidden');
}

// Función para registrar visita (API)
async function registerVisit(cedula) {
    const nombreUsuario = localStorage.getItem('usuario');  // Obtener el nombre del usuario logueado

    if (!nombreUsuario) {
        console.error('No se ha encontrado un usuario logueado.');
        return;
    }

    const cliente = clientes.find(c => c.cedula === cedula);  // Buscar el cliente por cédula
    if (!cliente) {
        console.error('Cliente no encontrado.');
        return;
    }

    const fechaVisita = new Date().toISOString().split('T')[0];  // Obtener la fecha en formato 'YYYY-MM-DD'

    // Preparar el JSON con la información del cliente, el usuario logueado y la fecha de la visita
    const data = {
        nombre: cliente.nombre,           // Nombre completo del cliente
        membresia: cliente.membresia,     // Membresía del cliente
        usuario: nombreUsuario,           // Nombre del usuario logueado
        fechaVisita: fechaVisita          // Fecha actual
    };

    try {
        const response = await fetch('http://www.musclegarage.somee.com/Visita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Visita registrada exitosamente:', result);
    } catch (error) {
        console.error('Error al registrar la visita:', error);
    }
}

// Función para pagar membresía (API)
async function payMembership(cedula) {
    const apiPaymentUrl = `${apiUrl}/pagar`;  // Ajusta la URL de tu API
    const paymentData = { cedula };

    try {
        const response = await fetch(apiPaymentUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });
        
        if (response.ok) {
            alert('Pago realizado con éxito');
        } else {
            console.error('Error al procesar el pago');
            alert('Ocurrió un error al procesar el pago');
        }
    } catch (error) {
        console.error('Error al procesar el pago:', error);
    }
}

// Cerrar el modal
closeModal.addEventListener('click', function() {
    modal.classList.add('hidden');
});

// Llamar a la función para obtener los clientes cuando la página carga
fetchClients();
