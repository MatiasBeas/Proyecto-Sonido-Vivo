// carrito.js
// Maneja el carrito de compras guardado en localStorage.
// Por ahora solo lleva la cuenta de productos agregados (el carrito completo va en otro paso).

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("sonidoVivoCarrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("sonidoVivoCarrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function agregarAlCarrito(id) {
    const carrito = obtenerCarrito();
    const item = carrito.find(p => p.id === id);

    if (item) {
        item.cantidad += 1;
    } else {
        carrito.push({ id, cantidad: 1 });
    }

    guardarCarrito(carrito);
}

function actualizarContadorCarrito() {
    const contador = document.querySelector("#contadorCarrito");
    if (!contador) return;

    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((suma, p) => suma + p.cantidad, 0);

    if (totalItems > 0) {
        contador.textContent = totalItems;
        contador.classList.remove("d-none");
    } else {
        contador.classList.add("d-none");
    }
}

// Se ejecuta apenas carga cualquier página que incluya este script
actualizarContadorCarrito();