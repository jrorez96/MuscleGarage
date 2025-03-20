// Función para realizar la consulta al API y mostrar los pagos
async function obtenerPagos(fechaInicio, fechaFin) {
    try {
        // Aquí coloca la URL de tu API
        const url = `https://www.musclegarage.somee.com/Pagos/pagosPorFecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        const respuesta = await fetch(url);
        const pagos = await respuesta.json();

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
        
            return `${day}/${month}/${year}`;
        }

        // Limpiar la tabla antes de agregar nuevos datos
        const pagoList = document.getElementById('pago-list');
        pagoList.innerHTML = '';

        let totalMonto = 0; // Inicializar el total del monto

        // Llenar la tabla con los datos obtenidos
        pagos.forEach(pago => {
            const fechaInicioC = pago.fechaDePago ? formatDate(pago.fechaDePago) : 'Sin fecha';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-3">${pago.cedula}</td>
                <td class="px-6 py-3">${pago.nombre}</td>
                <td class="px-6 py-3">${pago.membresia}</td>
                <td class="px-6 py-3">${fechaInicioC}</td>
                <td class="px-6 py-3">${pago.monto}</td>
                <td class="px-6 py-3">
                    <button class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700" onclick="">Eliminar</button>
                </td>
            `;
            pagoList.appendChild(row);

            totalMonto += parseFloat(pago.monto);
        });

        // Mostrar el total del monto al final de la tabla
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="4" class="px-6 py-3 font-bold text-right">Total:</td>
            <td class="px-6 py-3 font-bold">${totalMonto.toFixed(2)}</td>
            <td></td>
        `;
        pagoList.appendChild(totalRow);

    } catch (error) {
        console.error('Error al obtener los pagos:', error);
    }
}

// Llamada inicial para mostrar todos los pagos (sin filtro de fechas)
obtenerPagos('', '');

// Evento para buscar pagos por fecha
document.getElementById('buscar').addEventListener('click', () => {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    if (fechaInicio && fechaFin) {
        obtenerPagos(fechaInicio, fechaFin);
    } else {
        alert('Por favor selecciona ambas fechas.');
    }
});

// Función para descargar los datos de la tabla como archivo Excel
document.getElementById('descargarReporte').addEventListener('click', () => {
    const pagoList = document.getElementById('pago-list');
    const pagos = [];

    // Recolectar los datos de la tabla
    pagoList.querySelectorAll('tr').forEach(row => {
        const celdas = row.querySelectorAll('td');
        if (celdas.length < 5) return;
        const pago = {
            Cedula: celdas[0].textContent,
            Nombre: celdas[1].textContent,
            Membresia: celdas[2].textContent,
            'Fecha de Pago': celdas[3].textContent,
            Monto: celdas[4].textContent
        };
        pagos.push(pago);
    });

    // Crear un libro de trabajo (workbook) y una hoja (worksheet)
    const ws = XLSX.utils.json_to_sheet(pagos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pagos');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'reporte_pagos.xlsx');
});
