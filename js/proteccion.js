// proteccion.js
// Protege páginas según el rol requerido. Se debe cargar DESPUÉS de auth.js.

function protegerPagina(rolRequerido, permitirAdminSiempre = true) {
    const enCliente = window.location.pathname.includes("/Cliente/");
    const prefijo = enCliente ? "" : "../Cliente/";

    const sesionGuardada = localStorage.getItem("sonidoVivoSesion");

    if (!sesionGuardada) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = prefijo + "login.html";
        return;
    }

    const sesion = JSON.parse(sesionGuardada);
    const tienePermiso = sesion.rol === rolRequerido || (permitirAdminSiempre && sesion.rol === "administrador");

    if (!tienePermiso) {
        alert("No tienes permisos para acceder a esta página.");
        window.location.href = prefijo + "index.html";
    }
}