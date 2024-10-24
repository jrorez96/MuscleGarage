document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://www.musclegarage.somee.com/Usuarios'; // URL de tu API
    let users = [];
    let selectedUser = null;

    const searchInput = document.getElementById('searchInput');
    const usersTable = document.getElementById('usersTable');
    const editPopup = document.getElementById('editPopup');
    const editForm = document.getElementById('editForm');
    const editUser = document.getElementById('editUser');
    const editName = document.getElementById('editName');
    const editPassword = document.getElementById('editPassword');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Cargar usuarios desde la API
    async function loadUsers() {
        try {
            const response = await fetch(apiUrl);
            users = await response.json();
            renderUsers(users);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    }

    // Mostrar usuarios en la tabla
    function renderUsers(usersList) {
        usersTable.innerHTML = '';
        usersList.forEach(user => {
            const row = document.createElement('tr');
            row.classList.add('border-b');
            row.innerHTML = `
                <td class="p-2">${user.nombre}</td>
                <td class="p-2">${user.usuario}</td>
                <td class="p-2">${user.password}</td>
                <td class="p-2">
                    <button class="bg-yellow-500 text-white px-2 py-1 rounded editBtn" data-name="${user.nombre}">Editar</button>
                    <button class="bg-red-500 text-white px-2 py-1 rounded deleteBtn" data-name="${user.nombre}">Eliminar</button>
                </td>
            `;
            usersTable.appendChild(row);
        });

        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.editBtn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userName = this.getAttribute('data-name');
                openEditPopup(userName);
            });
        });

        document.querySelectorAll('.deleteBtn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userName = this.getAttribute('data-name');
                deleteUser(userName);
            });
        });
    }

    // Búsqueda de usuarios por nombre
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredUsers = users.filter(user => user.nombre.toLowerCase().includes(searchTerm));
        renderUsers(filteredUsers);
    });

    // Abrir el pop-up de edición
    function openEditPopup(userName) {
        selectedUser = users.find(user => user.nombre === userName);
        if (selectedUser) {
            editUser.value = selectedUser.usuario;
            editName.value = selectedUser.nombre;
            editPassword.value = selectedUser.password;
            editPopup.classList.remove('hidden');
        }
    }

    // Cerrar el pop-up de edición
    cancelBtn.addEventListener('click', function() {
        editPopup.classList.add('hidden');
    });

    // Guardar cambios y llamar al API de edición
    saveBtn.addEventListener('click', async function() {
        const updatedUser = {
            usuario: editUser.value,
            nombre: editName.value,
            password: editPassword.value
        };

        try {
            const response = await fetch(`${apiUrl}/${selectedUser.nombre}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                // Actualizar la lista de usuarios localmente
                const index = users.findIndex(user => user.nombre === selectedUser.nombre);
                users[index] = updatedUser;
                renderUsers(users);
                editPopup.classList.add('hidden');
            } else {
                console.error('Error al actualizar el usuario');
            }
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    });

    // Eliminar usuario
    async function deleteUser(userName) {
        try {
            const response = await fetch(`${apiUrl}/${userName}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Eliminar el usuario de la lista localmente
                users = users.filter(user => user.nombre !== userName);
                renderUsers(users);
            } else {
                console.error('Error al eliminar el usuario');
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    }

    // Cargar los usuarios al iniciar
    loadUsers();
});
