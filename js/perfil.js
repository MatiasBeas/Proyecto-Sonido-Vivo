// perfil.js
// Muestra y permite editar los datos del cliente logueado.

function cargarDatosPerfil() {
    const inputNombre = document.querySelector("#perfilNombre");
    const inputEmail = document.querySelector("#perfilEmail");

    if (!inputNombre) return;

    const sesionGuardada = JSON.parse(localStorage.getItem("sonidoVivoSesion"));
    if (!sesionGuardada) return;

    inputNombre.value = sesionGuardada.nombre || "";
    inputEmail.value = sesionGuardada.email || "";
}

cargarDatosPerfil();

const formPerfil = document.querySelector("#formPerfil");

if (formPerfil) {
    formPerfil.addEventListener("submit", event => {
        event.preventDefault();

        const perfilError = document.querySelector("#perfilError");
        const perfilExito = document.querySelector("#perfilExito");
        perfilExito.classList.add("d-none");

        const nuevoNombre = document.querySelector("#perfilNombre").value.trim();
        const passwordNueva = document.querySelector("#perfilPasswordNueva").value;
        const passwordConfirmar = document.querySelector("#perfilPasswordConfirmar").value;

        if (!nuevoNombre) {
            perfilError.textContent = "El nombre no puede estar vacío.";
            perfilError.classList.remove("d-none");
            return;
        }

        if (passwordNueva || passwordConfirmar) {
            if (passwordNueva.length < 6) {
                perfilError.textContent = "La nueva contraseña debe tener al menos 6 caracteres.";
                perfilError.classList.remove("d-none");
                return;
            }

            if (passwordNueva !== passwordConfirmar) {
                perfilError.textContent = "Las contraseñas no coinciden.";
                perfilError.classList.remove("d-none");
                return;
            }
        }

        // Actualiza sonidoVivoUsuarios (donde vive el registro real de la cuenta)
        const sesionGuardada = JSON.parse(localStorage.getItem("sonidoVivoSesion"));
        const usuarios = JSON.parse(localStorage.getItem("sonidoVivoUsuarios")) || [];
        const usuario = usuarios.find(u => u.email === sesionGuardada.email);

        if (usuario) {
            usuario.nombre = nuevoNombre;
            if (passwordNueva) {
                usuario.password = passwordNueva;
            }
            localStorage.setItem("sonidoVivoUsuarios", JSON.stringify(usuarios));
        }

        // Actualiza también la sesión activa, para que el navbar refleje el nombre nuevo
        sesionGuardada.nombre = nuevoNombre;
        localStorage.setItem("sonidoVivoSesion", JSON.stringify(sesionGuardada));

        perfilError.classList.add("d-none");
        perfilExito.textContent = "Datos actualizados correctamente.";
        perfilExito.classList.remove("d-none");

        document.querySelector("#perfilPasswordNueva").value = "";
        document.querySelector("#perfilPasswordConfirmar").value = "";
    });
}