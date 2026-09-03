// stock.js
// Maneja el stock editable del panel de vendedor.
// Guarda los cambios en localStorage, separados del arreglo original de productos.js.

function obtenerOverridesStock() {
    return JSON.parse(localStorage.getItem("sonidoVivoStock")) || {};
}

function guardarOverrideStock(id, nuevoStock) {
    const overrides = obtenerOverridesStock();
    overrides[id] = nuevoStock;
    localStorage.setItem("sonidoVivoStock", JSON.stringify(overrides));
}

function obtenerStockActual(producto) {
    const overrides = obtenerOverridesStock();
    return overrides.hasOwnProperty(producto.id) ? overrides[producto.id] : producto.stock;
}

function renderTablaStock() {
    const tbody = document.querySelector("#tablaStock");
    if (!tbody) return;

    tbody.innerHTML = "";

    productos.forEach(producto => {
        const stockActual = obtenerStockActual(producto);

        tbody.innerHTML += `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.marca}</td>
            <td>$${producto.precio.toLocaleString("es-CL")}</td>
            <td>${stockActual}</td>
            <td>
                <input type="number" min="0" value="${stockActual}"
                       class="form-control form-control-sm input-nuevo-stock"
                       data-id="${producto.id}" style="width: 90px;">
            </td>
            <td>
                <button class="btn btn-sm btn-accent btn-guardar-stock" data-id="${producto.id}">Guardar</button>
            </td>
        </tr>`;
    });
}

renderTablaStock();

// ---- Guardar cambios de stock ----
const tablaStock = document.querySelector("#tablaStock");

if (tablaStock) {
    tablaStock.addEventListener("click", event => {
        if (!event.target.classList.contains("btn-guardar-stock")) return;

        const id = Number(event.target.dataset.id);
        const fila = event.target.closest("tr");
        const input = fila.querySelector(".input-nuevo-stock");
        const nuevoStock = Number(input.value);

        if (isNaN(nuevoStock) || nuevoStock < 0) {
            alert("Ingresa un stock válido.");
            return;
        }

        guardarOverrideStock(id, nuevoStock);
        renderTablaStock();
        alert("Stock actualizado.");
    });
}