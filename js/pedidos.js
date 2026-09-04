// pedidos.js
// Muestra todos los pedidos (panel vendedor) y permite cambiar su estado.

const ESTADOS_POSIBLES = ["pendiente de pago", "en preparación", "listo para retiro/despacho", "entregado"];

function obtenerPedidos() {
    return JSON.parse(localStorage.getItem("sonidoVivoPedidos")) || [];
}

function guardarPedidos(pedidos) {
    localStorage.setItem("sonidoVivoPedidos", JSON.stringify(pedidos));
}

function renderTablaPedidos() {
    const tbody = document.querySelector("#tablaPedidos");
    const sinPedidos = document.querySelector("#sinPedidos");

    if (!tbody) return;

    const pedidos = obtenerPedidos();

    if (pedidos.length === 0) {
        tbody.innerHTML = "";
        sinPedidos.classList.remove("d-none");
        return;
    }

    sinPedidos.classList.add("d-none");
    tbody.innerHTML = "";

    pedidos.forEach(pedido => {
        const resumenProductos = pedido.productos
            .map(p => `${p.nombre} x${p.cantidad}`)
            .join(", ");

        const opcionesEstado = ESTADOS_POSIBLES
            .map(estado => `<option value="${estado}" ${pedido.estado === estado ? "selected" : ""}>${estado}</option>`)
            .join("");

        tbody.innerHTML += `
        <tr>
            <td>#${pedido.id}</td>
            <td>${pedido.clienteEmail}</td>
            <td class="small">${resumenProductos}</td>
            <td>$${pedido.total.toLocaleString("es-CL")}</td>
            <td class="small">${pedido.entrega}</td>
            <td class="small">${pedido.metodoPago} (${pedido.estadoPago})</td>
            <td>
                <select class="form-select form-select-sm select-estado" data-id="${pedido.id}" style="min-width: 180px;">
                    ${opcionesEstado}
                </select>
            </td>
        </tr>`;
    });
}

renderTablaPedidos();

// ---- Cambiar estado del pedido ----
const tablaPedidos = document.querySelector("#tablaPedidos");

if (tablaPedidos) {
    tablaPedidos.addEventListener("change", event => {
        if (!event.target.classList.contains("select-estado")) return;

        const id = Number(event.target.dataset.id);
        const nuevoEstado = event.target.value;

        const pedidos = obtenerPedidos();
        const pedido = pedidos.find(p => p.id === id);

        if (pedido) {
            pedido.estado = nuevoEstado;
            guardarPedidos(pedidos);
        }
    });
}