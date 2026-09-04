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

// ---- Mostrar/ocultar campos de tarjeta ----
const radiosPago = document.querySelectorAll('input[name="pago"]');
const bloqueTarjeta = document.querySelector("#bloqueTarjeta");

function actualizarSegunPago() {
    const pagoElegido = document.querySelector('input[name="pago"]:checked').value;

    if (pagoElegido === "tarjeta") {
        bloqueTarjeta.classList.remove("d-none");
    } else {
        bloqueTarjeta.classList.add("d-none");
    }
}

if (radiosPago.length > 0) {
    radiosPago.forEach(radio => {
        radio.addEventListener("change", actualizarSegunPago);
    });
    actualizarSegunPago();
}
if (radiosPago.length > 0) {
    radiosPago.forEach(radio => {
        radio.addEventListener("change", actualizarSegunPago);
    });
    actualizarSegunPago();
}

// ---- Auto-formato de campos de tarjeta ----
const numeroTarjetaInput = document.querySelector("#numeroTarjeta");
const vencimientoInput = document.querySelector("#vencimientoTarjeta");
const cvvInput = document.querySelector("#cvvTarjeta");

if (numeroTarjetaInput) {
    numeroTarjetaInput.addEventListener("input", () => {
        let valor = numeroTarjetaInput.value.replace(/\D/g, "").slice(0, 16);
        valor = valor.replace(/(.{4})/g, "$1 ").trim();
        numeroTarjetaInput.value = valor;
    });
}

if (vencimientoInput) {
    vencimientoInput.addEventListener("input", () => {
        let valor = vencimientoInput.value.replace(/\D/g, "").slice(0, 4);
        if (valor.length > 2) {
            valor = valor.slice(0, 2) + "/" + valor.slice(2);
        }
        vencimientoInput.value = valor;
    });
}

if (cvvInput) {
    cvvInput.addEventListener("input", () => {
        cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 3);
    });
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
        const pagoElegido = document.querySelector('input[name="pago"]:checked').value;
        const NUMERO_TARJETA_VALIDO = "4111111111111111";
        const VENCIMIENTO_VALIDO = "12/28";
        const CVV_VALIDO = "123";

        if (pagoElegido === "tarjeta") {
            const numeroIngresado = document.querySelector("#numeroTarjeta").value.replace(/\s/g, "");
            const vencimientoIngresado = document.querySelector("#vencimientoTarjeta").value;
            const cvvIngresado = document.querySelector("#cvvTarjeta").value;

            if (numeroIngresado.length !== 16 || vencimientoIngresado.length !== 5 || cvvIngresado.length !== 3) {
                checkoutError.textContent = "Completa todos los datos de la tarjeta.";
                checkoutError.classList.remove("d-none");
                return;
            }

            // Revisa que la fecha de vencimiento no esté vencida (formato MM/AA)
            const [mesIngresado, anioIngresado] = vencimientoIngresado.split("/").map(Number);
            const fechaActual = new Date();
            const anioActual = Number(String(fechaActual.getFullYear()).slice(2)); // ej: 2026 -> 26
            const mesActual = fechaActual.getMonth() + 1;

            const estaVencida =
                mesIngresado < 1 || mesIngresado > 12 ||
                anioIngresado < anioActual ||
                (anioIngresado === anioActual && mesIngresado < mesActual);

            if (estaVencida) {
                checkoutError.textContent = "La tarjeta está vencida. Verifica la fecha ingresada.";
                checkoutError.classList.remove("d-none");
                return;
            }

            if (numeroIngresado !== NUMERO_TARJETA_VALIDO || vencimientoIngresado !== VENCIMIENTO_VALIDO || cvvIngresado !== CVV_VALIDO) {
                checkoutError.textContent = "Pago rechazado. Verifica tu saldo o comunícate con tu banco.";
                checkoutError.classList.remove("d-none");
                return;
            }
        }

        checkoutError.classList.add("d-none");

        // ---- Armar y guardar el pedido ----
        const sesionGuardada = JSON.parse(localStorage.getItem("sonidoVivoSesion"));
        const carritoActual = obtenerCarrito();
        const subtotalPedido = calcularSubtotal();
        const descuentoPedido = cuponAplicado ? subtotalPedido * PORCENTAJE_DESCUENTO : 0;
        const totalPedido = subtotalPedido - descuentoPedido;

        const productosPedido = carritoActual.map(item => {
            const producto = productos.find(p => p.id === item.id);
            return {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: item.cantidad
            };
        });

        // Estado de pago según el método elegido
        let estadoPago = "pendiente de pago";
        let estadoPedido = "pendiente de pago";

        if (pagoElegido === "tarjeta") {
            estadoPago = "pagado";
            estadoPedido = "en preparación";
        } else if (pagoElegido === "tienda") {
            estadoPago = "pendiente (paga al retirar)";
            estadoPedido = "en preparación";
        }
        // Si es transferencia, se queda como "pendiente de pago" hasta que el vendedor lo confirme.

        const nuevoPedido = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            clienteEmail: sesionGuardada.email,
            productos: productosPedido,
            subtotal: subtotalPedido,
            descuento: descuentoPedido,
            total: totalPedido,
            entrega: entregaElegida,
            direccion: entregaElegida === "despacho" ? document.querySelector("#direccion").value.trim() : null,
            metodoPago: pagoElegido,
            estadoPago: estadoPago,
            estado: estadoPedido
        };

        const pedidos = JSON.parse(localStorage.getItem("sonidoVivoPedidos")) || [];
        pedidos.push(nuevoPedido);
        localStorage.setItem("sonidoVivoPedidos", JSON.stringify(pedidos));

        alert(`¡Pedido confirmado! Estado: ${estadoPedido}.`);

        localStorage.removeItem("sonidoVivoCarrito");
        window.location.href = "index.html";
    });
}