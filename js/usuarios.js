document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://www.musclegarage.somee.com/Usuarios'; // URL de tu API
    let users = [];
    let selectedUser = null;

    // Referencias al DOM
    const searchInput = document.getElementById('searchInput');
    const usersTable = document.getElementById('usersTable');
    const editPopup = document.getElementById('editPopup');
    const editForm = document.getElementById('editForm');
    const editUser = document.getElementById('editUser');
    const editName = document.getElementById('editName');
    const editPassword = document.getElementById('editPassword');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Nuevo: Referencias para "Agregar Usuario"
    const addUserBtn = document.getElementById('addUserBtn');
    const addPopup = document.getElementById('addPopup');
    const addUserName = document.getElementById('addUserName');
    const addUser = document.getElementById('addUser');
    const addPassword = document.getElementById('addPassword');
    const addSaveBtn = document.getElementById('addSaveBtn');
    const addCancelBtn = document.getElementById('addCancelBtn');
    const errorMsg = document.getElementById('errorMsg'); // Mensaje de error para validación

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
                <td class="p-2">${user.usuario}</td>
                <td class="p-2">${user.nombre}</td>
                <td class="p-2">${user.password}</td>
                <td class="p-2">
                    <button class="bg-yellow-500 text-white px-2 py-1 rounded editBtn" data-name="${user.nombre}">Editar</button>
                    <button class="bg-red-500 text-white px-2 py-1 rounded deleteBtn" data-name="${user.nombre}">Eliminar</button>
                </td>
            `;
            usersTable.appendChild(row);
        });

        // Eventos para editar y eliminar
        document.querySelectorAll('.editBtn').forEach(btn => {
            btn.addEventListener('click', function () {
                const userName = this.getAttribute('data-name');
                openEditPopup(userName);
            });
        });

        document.querySelectorAll('.deleteBtn').forEach(btn => {
            btn.addEventListener('click', function () {
                const userName = this.getAttribute('data-name');
                deleteUser(userName);
            });
        });
    }

    // Búsqueda de usuarios
    searchInput.addEventListener('input', function () {
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

    // Cerrar pop-up de edición
    cancelBtn.addEventListener('click', function () {
        editPopup.classList.add('hidden');
    });

    // Guardar cambios de edición
    saveBtn.addEventListener('click', async function () {
        const updatedUser = {
            usuario: editUser.value,
            nombre: editName.value,
            password: editPassword.value,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Error al actualizar el usuario');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    });

    // Eliminar usuario
    async function deleteUser(name) {
        try {
            const response = await fetch(`${apiUrl}/${name}`, { method: 'DELETE' });

            if (response.ok) {
                users = users.filter(user => user.nombre !== name);
                renderUsers(users);
            } else {
                console.error('Error al eliminar el usuario');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    }

    // Validar campos vacíos antes de agregar un usuario
    function validateFields() {
        if (!addUserName.value.trim() || !addUser.value.trim() || !addPassword.value.trim()) {
            errorMsg.classList.remove('hidden'); // Mostrar mensaje de error
            return false;
        }
        errorMsg.classList.add('hidden'); // Ocultar mensaje de error si todo está correcto
        return true;
    }

    // Nuevo: Abrir pop-up de "Agregar Usuario"
    addUserBtn.addEventListener('click', function () {
        addPopup.classList.remove('hidden');
    });

    // Nuevo: Cerrar pop-up de "Agregar Usuario"
    addCancelBtn.addEventListener('click', function () {
        addPopup.classList.add('hidden');
        errorMsg.classList.add('hidden'); // Ocultar mensaje de error al cerrar
    });

    // Nuevo: Guardar usuario nuevo
    addSaveBtn.addEventListener('click', async function () {
        if (!validateFields()) {
            return; // No continuar si hay campos vacíos
        }
        const newUser = {
            usuario: addUser.value,
            nombre: addUserName.value,
            password: addPassword.value,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                addPopup.classList.add('hidden');
                loadUsers();
            } else {
                console.error('Error al agregar el usuario');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
        }
    });

    // Cargar usuarios al iniciar
    loadUsers();
});
