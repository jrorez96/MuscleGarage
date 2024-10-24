document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchProductInput = document.getElementById('search-product');
    const apiUrl = 'http://www.musclegarage.somee.com/Productos';  // URL del API
    let products = [];
    const productPerPage = 10;  // Número de productos por página
    let currentPage = 1;

    // Llamado al API para consultar los productos
    async function fetchProducts() {
        try {
            const response = await fetch(apiUrl);
            products = await response.json();
            console.log(products);
            renderProducts();
        } catch (error) {
            console.error('Error al consultar los productos:', error);
        }
    }

    // Renderizar los productos filtrados
    function renderProducts() {
        const start = (currentPage - 1) * productPerPage;
        const end = start + productPerPage;
        const searchTerm = searchProductInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.nombre.toLowerCase().includes(searchTerm) || 
            product.cantidad.toLowerCase().includes(searchTerm) ||
            product.precio.toLowerCase().includes(searchTerm)
        );
        productList.innerHTML = filteredProducts.slice(start, end).map(product => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${product.nombre}</td>
                <td class="px-6 py-4 whitespace-nowrap">${product.cantidad}</td>
                <td class="px-6 py-4 whitespace-nowrap">${product.precio}</td>
                <td>
                    <button class="edit-btn bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-700" data-nombre="${product.nombre}">Editar</button>
                    <button class="delete-btn bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700" data-nombre="${product.nombre}">Eliminar</button>
                </td>
            </tr>
        `).join('');

        attachEventListeners();
    }

    // Filtrado en tiempo real
    searchProductInput.addEventListener('input', renderProducts);

    // Event Listeners para los botones
    function attachEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nombre = e.target.dataset.nombre;
                const product = products.find(p => p.nombre === nombre);  // Buscar producto por nombre
                showProductForm(product);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }

    // Manejador para el botón de agregar
    document.getElementById('add-product-btn').addEventListener('click', () => {
        showProductForm();  // No se pasa producto porque es un formulario vacío para agregar
    });

    // Mostrar el formulario de agregar/editar producto con estilos de modal
    function showProductForm(product = {}) {
        const formHtml = `
            <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 class="text-xl font-bold mb-4">${product.nombre ? 'Editar Producto' : 'Agregar Producto'}</h2>
                    <form id="product-form" class="space-y-4">
                        <div>
                            <label for="name" class="block font-medium">Nombre</label>
                            <input type="text" id="name" value="${product.nombre || ''}" class="w-full border border-gray-300 rounded-md p-2">
                        </div>
                        
                        <div>
                            <label for="cantidad" class="block font-medium">Cantidad</label>
                            <input type="number" id="cantidad" value="${product.cantidad || ''}" class="w-full border border-gray-300 rounded-md p-2">
                        </div>
                        
                        <div>
                            <label for="price" class="block font-medium">Precio</label>
                            <input type="number" id="price" value="${product.precio || ''}" class="w-full border border-gray-300 rounded-md p-2">
                        </div>
                        
                        <div class="flex justify-end space-x-4">
                            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">${product.nombre ? 'Guardar Cambios' : 'Agregar Producto'}</button>
                            <button type="button" id="close-form" class="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', formHtml);
        
        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (product.nombre) {
                handleEditSubmit(e, product.nombre);
            } else {
                handleAddSubmit(e);
            }
        });
        document.getElementById('close-form').addEventListener('click', () => {
            document.querySelector('.fixed').remove();
        });
    }

    // Manejador para agregar producto
    async function handleAddSubmit(e) {
        const nombre = document.getElementById('name').value;
        const cantidad = document.getElementById('cantidad').value;
        const precio = document.getElementById('price').value;
        
        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, cantidad, precio })
            });
            fetchProducts();  // Refresh list
            document.querySelector('.fixed').remove();
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    }

    // Manejador para editar producto
    async function handleEditSubmit(e, nombre) {
        const cantidad = document.getElementById('cantidad').value;
        const precio = document.getElementById('price').value;
        
        try {
            await fetch(`${apiUrl}`, {  // Usar el nombre como clave en lugar del ID
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, cantidad, precio })
            });
            fetchProducts();  // Refresh list
            document.querySelector('.fixed').remove();
        } catch (error) {
            console.error('Error al editar el producto:', error);
        }
    }

    // Manejador para eliminar producto
    async function handleDelete(e) {
        const nombre = e.target.dataset.nombre;
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await fetch(`${apiUrl}/${nombre}`, {  // Usar el nombre para eliminar
                    method: 'DELETE'
                });
                fetchProducts();  // Refresh list
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        }
    }

    // Inicializar la lista de productos
    fetchProducts();
});
