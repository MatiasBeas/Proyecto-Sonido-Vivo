// proteccion.js
// Protege páginas según el rol requerido. Se debe cargar DESPUÉS de auth.js.

function protegerPagina(rolRequerido) {
    const sesionGuardada = localStorage.getItem("sonidoVivoSesion");

    if (!sesionGuardada) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "../Cliente/login.html";
        return;
    }

    const sesion = JSON.parse(sesionGuardada);

    if (sesion.rol !== rolRequerido && sesion.rol !== "administrador") {
        alert("No tienes permisos para acceder a esta página.");
        window.location.href = "../Cliente/index.html";
    }
}