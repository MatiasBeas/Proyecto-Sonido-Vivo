// auth.js
// Simulación de autenticación mientras no hay backend (Spring Boot) conectado.

const formLogin = document.querySelector("#formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", event => {
        event.preventDefault(); // evita que la página se recargue

        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;

        if (!email || !password) {
            alert("Completa correo y contraseña.");
            return;
        }

        // Simulación de rol según el dominio del correo (temporal, sin backend real)
        let rol = "cliente";
        if (email.endsWith("@admin.com")) {
            rol = "administrador";
        } else if (email.endsWith("@vendedor.com")) {
            rol = "vendedor";
        }

        const sesion = { email, rol };
        localStorage.setItem("sonidoVivoSesion", JSON.stringify(sesion));

        alert(`Bienvenido/a. Rol detectado: ${rol}`);
        window.location.href = "index.html";
    });
}

// ---- Estado del navbar según la sesión ----
function actualizarNavbar() {
    const navInvitado = document.querySelector("#navInvitado");
    const navUsuario = document.querySelector("#navUsuario");
    const navUsuarioEmail = document.querySelector("#navUsuarioEmail");

    // Si esta página no tiene navbar con estos ids, no hace nada (por seguridad)
    if (!navInvitado || !navUsuario) return;

    const sesionGuardada = localStorage.getItem("sonidoVivoSesion");

    if (sesionGuardada) {
        const sesion = JSON.parse(sesionGuardada);
        navInvitado.classList.add("d-none");
        navUsuario.classList.remove("d-none");
        navUsuarioEmail.textContent = sesion.email;
    } else {
        navInvitado.classList.remove("d-none");
        navUsuario.classList.add("d-none");
    }
}

// ---- Cerrar sesión ----
const btnCerrarSesion = document.querySelector("#btnCerrarSesion");

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", event => {
        event.preventDefault();
        localStorage.removeItem("sonidoVivoSesion");
        window.location.href = "index.html";
    });
}

// Se ejecuta cada vez que carga cualquier página que incluya auth.js
actualizarNavbar();