// auth.js
// Simulación de autenticación mientras no hay backend (Spring Boot) conectado.

// ---- Login ----
const formLogin = document.querySelector("#formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", event => {
        event.preventDefault();

        const loginError = document.querySelector("#loginError");
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;

        if (!email || !password) {
            loginError.textContent = "Completa correo y contraseña.";
            loginError.classList.remove("d-none");
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("sonidoVivoUsuarios")) || [];
        const usuario = usuarios.find(u => u.email === email && u.password === password);

        if (!usuario) {
            loginError.textContent = "Correo o contraseña incorrectos.";
            loginError.classList.remove("d-none");
            return;
        }
        if (usuario.activo === false) {
            loginError.textContent = "Tu cuenta ha sido desactivada. Contacta al administrador.";
            loginError.classList.remove("d-none");
            return;
        }

        let rol = usuario.rol;
        if (!rol) {
            // Respaldo para cuentas de prueba creadas antes de este cambio
            rol = "cliente";
            if (email.endsWith("@admin.com")) {
                rol = "administrador";
            } else if (email.endsWith("@vendedor.com")) {
                rol = "vendedor";
            }
        }

        const sesion = { email, nombre: usuario.nombre, rol };
        localStorage.setItem("sonidoVivoSesion", JSON.stringify(sesion));

        alert(`Bienvenido/a, ${usuario.nombre}. Rol detectado: ${rol}`);

        // Prioridad 1: si venía de un lugar específico (como el checkout), lo devuelve ahí
        const destino = localStorage.getItem("sonidoVivoRedirect");
        if (destino) {
            localStorage.removeItem("sonidoVivoRedirect");
            window.location.href = destino;
            return;
        }

        // Prioridad 2: si no venía de ningún lado en particular, lo manda según su rol
        if (rol === "vendedor") {
            window.location.href = "../Vendedor/vendedor.html";
        } else if (rol === "administrador") {
            window.location.href = "../Admin/admin.html";
        } else {
            window.location.href = "index.html";
        }
    });
}

// ---- Registro ----
const formRegistro = document.querySelector("#formRegistro");

if (formRegistro) {
    formRegistro.addEventListener("submit", event => {
        event.preventDefault();

        const registroError = document.querySelector("#registroError");
        const nombre = document.querySelector("#nombre").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#confirmPassword").value;

        if (!nombre || !email || !password || !confirmPassword) {
            registroError.textContent = "Completa todos los campos.";
            registroError.classList.remove("d-none");
            return;
        }

        if (password.length < 6) {
            registroError.textContent = "La contraseña debe tener al menos 6 caracteres.";
            registroError.classList.remove("d-none");
            return;
        }

        if (password !== confirmPassword) {
            registroError.textContent = "Las contraseñas no coinciden.";
            registroError.classList.remove("d-none");
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("sonidoVivoUsuarios")) || [];
        const yaExiste = usuarios.some(u => u.email === email);

        if (yaExiste) {
            registroError.textContent = "Ya existe una cuenta con ese correo.";
            registroError.classList.remove("d-none");
            return;
        }

        let rolNuevo = "cliente";
        if (email.endsWith("@admin.com")) {
            rolNuevo = "administrador";
        } else if (email.endsWith("@vendedor.com")) {
            rolNuevo = "vendedor";
        }

        usuarios.push({ nombre, email, password, rol: rolNuevo });
        localStorage.setItem("sonidoVivoUsuarios", JSON.stringify(usuarios));

        alert("Cuenta creada con éxito. Ahora inicia sesión.");
        window.location.href = "login.html";
    });
}

// ---- Estado del navbar según la sesión ----
function actualizarNavbar() {
    const navInvitado = document.querySelector("#navInvitado");
    const navUsuario = document.querySelector("#navUsuario");
    const navUsuarioEmail = document.querySelector("#navUsuarioEmail");

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

        // Si ya estamos dentro de Cliente/, index.html está en la misma carpeta.
        // Si estamos en Vendedor/ o Admin/, hay que salir y entrar a Cliente/.
        const enCliente = window.location.pathname.includes("/Cliente/");
        window.location.href = enCliente ? "index.html" : "../Cliente/index.html";
    });
}

actualizarNavbar();

// ---- Aviso si venía redirigido desde otra parte (ej. checkout) ----
function mostrarAvisoRedireccion() {
    const avisoLogin = document.querySelector("#avisoLogin");
    if (!avisoLogin) return;

    const destino = localStorage.getItem("sonidoVivoRedirect");
    if (destino) {
        avisoLogin.classList.remove("d-none");
    }
}

mostrarAvisoRedireccion();