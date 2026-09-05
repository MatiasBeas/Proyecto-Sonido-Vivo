// productosAdmin.js
// Combina el catálogo original (productos.js) con los cambios guardados por el
// administrador: productos nuevos, ediciones, y eliminaciones (marcadas, no borradas físicamente).

function obtenerProductosNuevos() {
    return JSON.parse(localStorage.getItem("sonidoVivoProductosNuevos")) || [];
}

function guardarProductosNuevos(lista) {
    localStorage.setItem("sonidoVivoProductosNuevos", JSON.stringify(lista));
}

function obtenerEdiciones() {
    return JSON.parse(localStorage.getItem("sonidoVivoProductosEditados")) || {};
}

function guardarEdiciones(ediciones) {
    localStorage.setItem("sonidoVivoProductosEditados", JSON.stringify(ediciones));
}

function obtenerEliminados() {
    return JSON.parse(localStorage.getItem("sonidoVivoProductosEliminados")) || [];
}

function guardarEliminados(lista) {
    localStorage.setItem("sonidoVivoProductosEliminados", JSON.stringify(lista));
}

// Devuelve el catálogo completo y actualizado: originales (con ediciones aplicadas,
// sin los eliminados) + los productos nuevos que agregó el administrador.
function obtenerCatalogoCompleto() {
    const eliminados = obtenerEliminados();
    const ediciones = obtenerEdiciones();

    const originalesVigentes = productos
        .filter(p => !eliminados.includes(p.id))
        .map(p => ediciones[p.id] ? { ...p, ...ediciones[p.id] } : p);

    const nuevos = obtenerProductosNuevos().filter(p => !eliminados.includes(p.id));

    return [...originalesVigentes, ...nuevos];
}

function generarNuevoId() {
    const catalogoCompleto = obtenerCatalogoCompleto();
    const idsExistentes = catalogoCompleto.map(p => p.id);
    return idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;
}

function agregarProductoNuevo(producto) {
    const nuevos = obtenerProductosNuevos();
    nuevos.push(producto);
    guardarProductosNuevos(nuevos);
}

function editarProducto(id, cambios) {
    const esOriginal = productos.some(p => p.id === id);

    if (esOriginal) {
        const ediciones = obtenerEdiciones();
        ediciones[id] = { ...(ediciones[id] || {}), ...cambios };
        guardarEdiciones(ediciones);
    } else {
        const nuevos = obtenerProductosNuevos();
        const producto = nuevos.find(p => p.id === id);
        if (producto) Object.assign(producto, cambios);
        guardarProductosNuevos(nuevos);
    }
}

function eliminarProducto(id) {
    const eliminados = obtenerEliminados();
    if (!eliminados.includes(id)) {
        eliminados.push(id);
        guardarEliminados(eliminados);
    }
}

// ---- Renderizar la tabla ----
function renderTablaProductosAdmin() {
    const tbody = document.querySelector("#tablaProductosAdmin");
    if (!tbody) return;

    const catalogo = obtenerCatalogoCompleto();
    tbody.innerHTML = "";

    catalogo.forEach(producto => {
        tbody.innerHTML += `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.marca}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precio.toLocaleString("es-CL")}</td>
            <td>${producto.stock}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary btn-editar-producto" data-id="${producto.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar-producto" data-id="${producto.id}">Eliminar</button>
            </td>
        </tr>`;
    });
}

renderTablaProductosAdmin();

// ---- Mostrar/ocultar el formulario ----
const formularioProductoCard = document.querySelector("#formularioProductoCard");
const formProducto = document.querySelector("#formProducto");
const tituloFormularioProducto = document.querySelector("#tituloFormularioProducto");
const btnNuevoProducto = document.querySelector("#btnNuevoProducto");
const btnCancelarProducto = document.querySelector("#btnCancelarProducto");

function limpiarFormularioProducto() {
    formProducto.reset();
    document.querySelector("#productoId").value = "";
}

function mostrarFormularioProducto(modo, producto = null) {
    limpiarFormularioProducto();

    if (modo === "editar" && producto) {
        tituloFormularioProducto.textContent = "Editar producto";
        document.querySelector("#productoId").value = producto.id;
        document.querySelector("#productoNombre").value = producto.nombre;
        document.querySelector("#productoMarca").value = producto.marca;
        document.querySelector("#productoModelo").value = producto.modelo;
        document.querySelector("#productoCategoria").value = producto.categoria;
        document.querySelector("#productoPrecio").value = producto.precio;
        document.querySelector("#productoStock").value = producto.stock;
        document.querySelector("#productoImagen").value = producto.imagen || "";
        document.querySelector("#productoDescripcion").value = producto.descripcion || "";
    } else {
        tituloFormularioProducto.textContent = "Nuevo producto";
    }

    formularioProductoCard.classList.remove("d-none");
    formularioProductoCard.scrollIntoView({ behavior: "smooth" });
}

if (btnNuevoProducto) {
    btnNuevoProducto.addEventListener("click", () => {
        mostrarFormularioProducto("nuevo");
    });
}

if (btnCancelarProducto) {
    btnCancelarProducto.addEventListener("click", () => {
        formularioProductoCard.classList.add("d-none");
    });
}

// ---- Editar / Eliminar desde la tabla ----
const tablaProductosAdmin = document.querySelector("#tablaProductosAdmin");

if (tablaProductosAdmin) {
    tablaProductosAdmin.addEventListener("click", event => {
        const id = Number(event.target.dataset.id);

        if (event.target.classList.contains("btn-editar-producto")) {
            const catalogo = obtenerCatalogoCompleto();
            const producto = catalogo.find(p => p.id === id);
            if (producto) mostrarFormularioProducto("editar", producto);
        }

        if (event.target.classList.contains("btn-eliminar-producto")) {
            if (confirm("¿Seguro que quieres eliminar este producto?")) {
                eliminarProducto(id);
                renderTablaProductosAdmin();
            }
        }
    });
}

// ---- Guardar (crear o editar) ----
if (formProducto) {
    formProducto.addEventListener("submit", event => {
        event.preventDefault();

        const productoError = document.querySelector("#productoError");
        const idExistente = document.querySelector("#productoId").value;

        const datosProducto = {
            nombre: document.querySelector("#productoNombre").value.trim(),
            marca: document.querySelector("#productoMarca").value.trim(),
            modelo: document.querySelector("#productoModelo").value.trim(),
            categoria: document.querySelector("#productoCategoria").value.trim(),
            precio: Number(document.querySelector("#productoPrecio").value),
            stock: Number(document.querySelector("#productoStock").value),
            imagen: document.querySelector("#productoImagen").value.trim() || "https://placehold.co/600x400?text=Producto",
            descripcion: document.querySelector("#productoDescripcion").value.trim()
        };

        if (!datosProducto.nombre || !datosProducto.marca || !datosProducto.categoria) {
            productoError.textContent = "Completa los campos obligatorios.";
            productoError.classList.remove("d-none");
            return;
        }

        if (isNaN(datosProducto.precio) || datosProducto.precio < 0 || isNaN(datosProducto.stock) || datosProducto.stock < 0) {
            productoError.textContent = "Precio y stock deben ser números válidos.";
            productoError.classList.remove("d-none");
            return;
        }

        productoError.classList.add("d-none");

        if (idExistente) {
            editarProducto(Number(idExistente), datosProducto);
        } else {
            const nuevoProducto = { id: generarNuevoId(), ...datosProducto };
            agregarProductoNuevo(nuevoProducto);
        }

        formularioProductoCard.classList.add("d-none");
        renderTablaProductosAdmin();
    });
}