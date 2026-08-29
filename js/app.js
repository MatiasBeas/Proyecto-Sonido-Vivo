// app.js
// Sonido Vivo - Catálogo dinámico
// Sigue el patrón del Módulo 5 de la guía: los datos son la fuente de verdad,
// renderProductos() los transforma en cards de Bootstrap.

// productos viene de js/productos.js (cárgalo ANTES que este archivo en el HTML)

const contenedor = document.querySelector("#contenedorProductos");
const cantidad = document.querySelector("#cantidadProductos");


// 5.3 Renderizar -----------------------------------------------------------
function renderProductos(lista) {
    contenedor.innerHTML = "";

    lista.forEach(producto => {
        contenedor.innerHTML += `
            <div class="col-sm-6 col-lg-4">
                <article class="card card-producto h-100 shadow-sm">
                    <img src="${producto.imagen}"
                         class="card-img-top"
                         alt="${producto.nombre}">
                    <div class="card-body d-flex flex-column">
                        <span class="badge badge-categoria align-self-start mb-2">
                            ${producto.categoria}
                        </span>
                        <h2 class="h5">${producto.nombre}</h2>
                        <p class="text-muted mb-1">${producto.marca} — ${producto.modelo}</p>
                        <p class="small flex-grow-1">${producto.descripcion}</p>
                        <p class="fs-5 fw-bold mb-1">$${producto.precio.toLocaleString("es-CL")}</p>
                        <p class="small ${producto.stock === 0 ? "text-danger" : "text-success"}">
                            ${producto.stock === 0 ? "Sin stock" : "Stock: " + producto.stock}
                        </p>
                        <button class="btn btn-accent mt-auto btn-agregar"
                                data-id="${producto.id}"
                                ${producto.stock === 0 ? "disabled" : ""}>
                            Agregar al carrito
                        </button>
                    </div>
                </article>
            </div>`;
    });

    cantidad.textContent = `${lista.length} productos`;
}

// 5.4 Delegación de eventos (funciona aunque las cards se creen dinámicamente)
contenedor.addEventListener("click", event => {
    if (!event.target.classList.contains("btn-agregar")) {
        return;
    }
    const id = Number(event.target.dataset.id);
    agregarAlCarrito(id);
});

// PRUEBA TÚ 20-23 de la guía: filtro por categoría -------------------------
// Filtro por categoría + búsqueda por texto ---------------------------------
const selectCategoria = document.querySelector("#filtroCategoria");
const inputBuscar = document.querySelector("#buscarProducto");

if (selectCategoria) {
    // arma las opciones del <select> automáticamente a partir del catálogo
    const categorias = [...new Set(productos.map(p => p.categoria))];
    categorias.forEach(cat => {
        const opcion = document.createElement("option");
        opcion.value = cat;
        opcion.textContent = cat;
        selectCategoria.appendChild(opcion);
    });
}

function aplicarFiltros() {
    const categoriaElegida = selectCategoria ? selectCategoria.value : "todos";
    const texto = inputBuscar ? inputBuscar.value.trim().toLowerCase() : "";

    const resultado = productos.filter(p => {
        const coincideCategoria = categoriaElegida === "todos" || p.categoria === categoriaElegida;
        const coincideTexto =
            texto === "" ||
            p.nombre.toLowerCase().includes(texto) ||
            p.marca.toLowerCase().includes(texto);
        return coincideCategoria && coincideTexto;
    });

    renderProductos(resultado);
}

if (selectCategoria) {
    selectCategoria.addEventListener("change", aplicarFiltros);
}

if (inputBuscar) {
    inputBuscar.addEventListener("input", aplicarFiltros);
}

// Primer render al cargar la página
renderProductos(productos);