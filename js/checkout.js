// checkout.js
// Muestra/oculta bloques del formulario según la opción de entrega elegida.

const radiosEntrega = document.querySelectorAll('input[name="entrega"]');
const bloqueDireccion = document.querySelector("#bloqueDireccion");
const opcionPagoTienda = document.querySelector("#opcionPagoTienda");
const pagoTiendaInput = document.querySelector("#pagoTienda");
const pagoTransferenciaInput = document.querySelector("#pagoTransferencia");

function actualizarSegunEntrega() {
    const entregaElegida = document.querySelector('input[name="entrega"]:checked').value;

    if (entregaElegida === "despacho") {
        bloqueDireccion.classList.remove("d-none");
        opcionPagoTienda.classList.add("d-none");

        // Si tenía seleccionado "pago en tienda" y cambió a despacho, lo cambiamos por transferencia
        if (pagoTiendaInput.checked) {
            pagoTransferenciaInput.checked = true;
        }
    } else {
        bloqueDireccion.classList.add("d-none");
        opcionPagoTienda.classList.remove("d-none");
    }
}

if (radiosEntrega.length > 0) {
    radiosEntrega.forEach(radio => {
        radio.addEventListener("change", actualizarSegunEntrega);
    });

    // Ejecuta una vez al cargar, para que quede bien desde el principio
    actualizarSegunEntrega();
}

// ---- Resumen del pedido ----
let cuponAplicado = false;
const CODIGO_CUPON = "SONIDO10";
const PORCENTAJE_DESCUENTO = 0.05;

function calcularSubtotal() {
    const carrito = obtenerCarrito();
    let subtotal = 0;

    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (!producto) return;
        subtotal += producto.precio * item.cantidad;
    });

    return subtotal;
}

function renderResumenCheckout() {
    const resumenEl = document.querySelector("#resumenCheckout");
    const subtotalEl = document.querySelector("#subtotalCheckout");
    const filaDescuento = document.querySelector("#filaDescuento");
    const descuentoEl = document.querySelector("#descuentoCheckout");
    const totalEl = document.querySelector("#totalCheckout");

    if (!resumenEl) return;

    const carrito = obtenerCarrito();
    resumenEl.innerHTML = "";

    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (!producto) return;

        const subtotalProducto = producto.precio * item.cantidad;

        resumenEl.innerHTML += `
        <div class="d-flex justify-content-between small mb-2">
            <span>${producto.nombre} x${item.cantidad}</span>
            <span>$${subtotalProducto.toLocaleString("es-CL")}</span>
        </div>`;
    });

    const subtotal = calcularSubtotal();
    const descuento = cuponAplicado ? subtotal * PORCENTAJE_DESCUENTO : 0;
    const total = subtotal - descuento;

    subtotalEl.textContent = `$${subtotal.toLocaleString("es-CL")}`;

    if (cuponAplicado) {
        filaDescuento.classList.remove("d-none");
        descuentoEl.textContent = `-$${descuento.toLocaleString("es-CL")}`;
    } else {
        filaDescuento.classList.add("d-none");
    }

    totalEl.textContent = `$${total.toLocaleString("es-CL")}`;
}

renderResumenCheckout();

// ---- Aplicar cupón ----
const btnAplicarCupon = document.querySelector("#btnAplicarCupon");

if (btnAplicarCupon) {
    btnAplicarCupon.addEventListener("click", () => {
        const cuponInput = document.querySelector("#cuponInput");
        const mensajeCupon = document.querySelector("#mensajeCupon");
        const codigoIngresado = cuponInput.value.trim().toUpperCase();

        if (codigoIngresado === CODIGO_CUPON) {
            cuponAplicado = true;
            mensajeCupon.textContent = "¡Cupón aplicado! 5% de descuento.";;
            mensajeCupon.className = "small mt-1 text-success";
        } else {
            cuponAplicado = false;
            mensajeCupon.textContent = "Cupón no válido.";
            mensajeCupon.className = "small mt-1 text-danger";
        }

        renderResumenCheckout();
    });
}

renderResumenCheckout();

// ---- Confirmar pedido ----
const formCheckout = document.querySelector("#formCheckout");

if (formCheckout) {
    formCheckout.addEventListener("submit", event => {
        event.preventDefault();

        const checkoutError = document.querySelector("#checkoutError");
        const carrito = obtenerCarrito();

        if (carrito.length === 0) {
            checkoutError.textContent = "Tu carrito está vacío.";
            checkoutError.classList.remove("d-none");
            return;
        }

        const entregaElegida = document.querySelector('input[name="entrega"]:checked').value;

        if (entregaElegida === "despacho") {
            const direccion = document.querySelector("#direccion").value.trim();
            if (!direccion) {
                checkoutError.textContent = "Ingresa la dirección de despacho.";
                checkoutError.classList.remove("d-none");
                return;
            }
        }

        checkoutError.classList.add("d-none");

        // Simulación: en un backend real, aquí se enviaría el pedido al servidor.
        alert("¡Pedido confirmado! Quedó registrado con estado 'en preparación'.");

        localStorage.removeItem("sonidoVivoCarrito");
        window.location.href = "index.html";
    });
}