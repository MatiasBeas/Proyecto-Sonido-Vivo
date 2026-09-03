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

function renderCarrito() {
    const contenedorLista = document.querySelector("#listaCarrito");
    const carritoVacio = document.querySelector("#carritoVacio");
    const resumenCarrito = document.querySelector("#resumenCarrito");
    const totalCarritoEl = document.querySelector("#totalCarrito");

    // Esta función solo aplica en carrito.html
    if (!contenedorLista) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedorLista.innerHTML = "";
        carritoVacio.classList.remove("d-none");
        resumenCarrito.classList.add("d-none");
        return;
    }

    carritoVacio.classList.add("d-none");
    resumenCarrito.classList.remove("d-none");

    let total = 0;
    contenedorLista.innerHTML = "";

    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (!producto) return; // por si el producto ya no existe en el catálogo

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        contenedorLista.innerHTML += `
        <div class="d-flex align-items-center border-bottom py-3 gap-3">
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            <div class="flex-grow-1">
                <h6 class="mb-1">${producto.nombre}</h6>
                <p class="text-muted mb-0 small">$${producto.precio.toLocaleString("es-CL")} c/u</p>
            </div>
            <input type="number" min="1" value="${item.cantidad}" data-id="${producto.id}"
                   class="form-control input-cantidad" style="width: 70px;">
            <p class="fw-bold mb-0" style="min-width: 90px;">$${subtotal.toLocaleString("es-CL")}</p>
            <button class="btn btn-outline-danger btn-sm btn-eliminar" data-id="${producto.id}">Eliminar</button>
        </div>`;
    });

    totalCarritoEl.textContent = `$${total.toLocaleString("es-CL")}`;
}

renderCarrito();

// ---- Cambiar cantidad y eliminar productos (delegación de eventos) ----
const contenedorLista = document.querySelector("#listaCarrito");

if (contenedorLista) {
    // Cambiar cantidad
    contenedorLista.addEventListener("change", event => {
        if (!event.target.classList.contains("input-cantidad")) return;

        const id = Number(event.target.dataset.id);
        let nuevaCantidad = Number(event.target.value);

        if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) {
            nuevaCantidad = 1;
        }

        const carrito = obtenerCarrito();
        const item = carrito.find(p => p.id === id);
        if (item) {
            item.cantidad = nuevaCantidad;
        }

        guardarCarrito(carrito);
        renderCarrito();
    });

    // Eliminar producto
    contenedorLista.addEventListener("click", event => {
        if (!event.target.classList.contains("btn-eliminar")) return;

        const id = Number(event.target.dataset.id);
        let carrito = obtenerCarrito();
        carrito = carrito.filter(p => p.id !== id);

        guardarCarrito(carrito);
        renderCarrito();
    });
}

// ---- Ir al checkout ----
const btnConfirmarPedido = document.querySelector("#btnConfirmarPedido");

if (btnConfirmarPedido) {
    btnConfirmarPedido.addEventListener("click", () => {
        const sesion = localStorage.getItem("sonidoVivoSesion");

        if (!sesion) {
            // Guarda a dónde quería ir, para volver ahí después de iniciar sesión
            localStorage.setItem("sonidoVivoRedirect", "checkout.html");
            window.location.href = "login.html";
            return;
        }

        window.location.href = "checkout.html";
    });
}