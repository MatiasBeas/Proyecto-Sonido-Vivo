// misPedidos.js
// Muestra solo los pedidos del cliente que tiene la sesión activa.

function renderMisPedidos() {
    const contenedor = document.querySelector("#listaPedidosCliente");
    const sinPedidos = document.querySelector("#sinPedidosCliente");

    if (!contenedor) return;

    const sesionGuardada = JSON.parse(localStorage.getItem("sonidoVivoSesion"));
    if (!sesionGuardada) return; // proteccion.js ya se encarga de redirigir si no hay sesión

    const todosLosPedidos = JSON.parse(localStorage.getItem("sonidoVivoPedidos")) || [];
    const misPedidos = todosLosPedidos.filter(p => p.clienteEmail === sesionGuardada.email);

    if (misPedidos.length === 0) {
        contenedor.innerHTML = "";
        sinPedidos.classList.remove("d-none");
        return;
    }

    sinPedidos.classList.add("d-none");
    contenedor.innerHTML = "";

    // Muestra los más recientes primero
    misPedidos.reverse().forEach(pedido => {
        const resumenProductos = pedido.productos
            .map(p => `${p.nombre} x${p.cantidad}`)
            .join(", ");

        const fecha = new Date(pedido.fecha).toLocaleDateString("es-CL");

        let claseEstado = "text-muted";
        if (pedido.estado === "en preparación") claseEstado = "stock-bajo";
        if (pedido.estado === "listo para retiro/despacho") claseEstado = "text-primary";
        if (pedido.estado === "entregado") claseEstado = "stock-ok";
        if (pedido.estado === "pendiente de pago") claseEstado = "stock-agotado";

        contenedor.innerHTML += `
        <div class="seccion-card">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                    <h6 class="mb-1">Pedido #${pedido.id}</h6>
                    <p class="small text-muted mb-2">${fecha}</p>
                    <p class="small mb-1">${resumenProductos}</p>
                    <p class="small mb-0">Entrega: ${pedido.entrega} · Pago: ${pedido.metodoPago}</p>
                </div>
                <div class="text-end">
                    <p class="fw-bold mb-1">$${pedido.total.toLocaleString("es-CL")}</p>
                    <span class="small fw-bold ${claseEstado}">${pedido.estado}</span>
                </div>
            </div>
        </div>`;
    });
}

renderMisPedidos();