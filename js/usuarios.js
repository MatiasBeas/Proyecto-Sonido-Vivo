// usuarios.js
// Gestión de usuarios (panel de administrador).

const ROLES_POSIBLES = ["cliente", "vendedor", "administrador"];

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("sonidoVivoUsuarios")) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("sonidoVivoUsuarios", JSON.stringify(usuarios));
}

function renderTablaUsuarios() {
    const tbody = document.querySelector("#tablaUsuarios");
    if (!tbody) return;

    const usuarios = obtenerUsuarios();
    tbody.innerHTML = "";

    usuarios.forEach(usuario => {
        const rolActual = usuario.rol || "cliente";
        const estaActivo = usuario.activo !== false; // por defecto, activo

        const opcionesRol = ROLES_POSIBLES
            .map(r => `<option value="${r}" ${rolActual === r ? "selected" : ""}>${r}</option>`)
            .join("");

        tbody.innerHTML += `
        <tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>
                <select class="form-select form-select-sm select-rol" data-email="${usuario.email}" style="min-width: 150px;">
                    ${opcionesRol}
                </select>
            </td>
            <td>
                <span class="small fw-bold ${estaActivo ? "stock-ok" : "stock-agotado"}">
                    ${estaActivo ? "Activo" : "Desactivado"}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-secondary btn-toggle-activo" data-email="${usuario.email}">
                    ${estaActivo ? "Desactivar" : "Activar"}
                </button>
            </td>
        </tr>`;
    });
}

renderTablaUsuarios();

// ---- Cambiar rol ----
const tablaUsuarios = document.querySelector("#tablaUsuarios");

if (tablaUsuarios) {
    tablaUsuarios.addEventListener("change", event => {
        if (!event.target.classList.contains("select-rol")) return;

        const email = event.target.dataset.email;
        const nuevoRol = event.target.value;

        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find(u => u.email === email);

        if (usuario) {
            usuario.rol = nuevoRol;
            guardarUsuarios(usuarios);

            // Si el usuario tiene sesión activa en este mismo navegador, la actualizamos también
            const sesionGuardada = JSON.parse(localStorage.getItem("sonidoVivoSesion"));
            if (sesionGuardada && sesionGuardada.email === email) {
                sesionGuardada.rol = nuevoRol;
                localStorage.setItem("sonidoVivoSesion", JSON.stringify(sesionGuardada));
            }
        }
    });

    // ---- Activar / desactivar ----
    tablaUsuarios.addEventListener("click", event => {
        if (!event.target.classList.contains("btn-toggle-activo")) return;

        const email = event.target.dataset.email;
        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find(u => u.email === email);

        if (usuario) {
            usuario.activo = usuario.activo === false ? true : false;
            guardarUsuarios(usuarios);
            renderTablaUsuarios();
        }
    });
}