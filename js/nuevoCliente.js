document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    const membresiaSelect = document.getElementById('membresia');

    function cargarMembresias() {
        fetch('https://www.musclegarage.somee.com/Membresias') // Reemplaza con la URL correcta de tu API
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la carga de membresías: ' + response.statusText);
                }
                return response.json();
            })
            .then(membresias => {
                console.log('Datos de membresías recibidos:', membresias); // Imprimir los datos recibidos
                membresias.forEach(membresia => {
                    const option = document.createElement('option');
                    option.value = membresia.nombre; // Verifica que 'id' sea la propiedad correcta
                    option.textContent = membresia.nombre; // Verifica que 'nombre' sea la propiedad correcta
                    membresiaSelect.appendChild(option);
                });
                console.log('Membresías cargadas:', membresias);
            })
            .catch(error => {
                alert('Error al cargar las membresías: ' + error.message);
            });
    }

    cargarMembresias();

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        const cliente = {
            cedula: document.getElementById('cedula').value,
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            correo: document.getElementById('email').value,
            fechaInicio: document.getElementById('fechaInicio').value,
            membresia: membresiaSelect.value,
            factura: document.getElementById('factura').value
        };

        console.log('Datos del cliente a enviar:', cliente);
        console.log('Valor de membresía seleccionado:', membresiaSelect.value);

        fetch('https://www.musclegarage.somee.com/Clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            alert(data.message);
            formulario.reset();
            membresiaSelect.innerHTML = '<option value="" disabled selected>Selecciona una membresía</option>';
            cargarMembresias();
        })
        .catch(error => {
            console.error('Error al agregar el cliente:', error);
            alert('Error al agregar el cliente: ' + error.message);
        });
    });
});
