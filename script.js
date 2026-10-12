const form = document.getElementById("betaForm");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const errorIds = {
  nombre: "nombreError",
  perfil: "perfilError",
  correo: "correoError",
  necesidad: "necesidadError",
  interes: "interesError",
  consentimiento: "consentimientoError"
};

function clearErrors() {
  Object.values(errorIds).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
  document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
  formMessage.className = "form-message";
  formMessage.textContent = "";
}
function showError(field, message) {
  const error = document.getElementById(errorIds[field]);
  if (error) error.textContent = message;
  const input = document.getElementById(field);
  if (input) input.classList.add("invalid");
}
function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}
function setMessage(type, message) {
  formMessage.className = `form-message ${type}`;
  formMessage.textContent = message;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();

  const nombre = document.getElementById("nombre").value.trim();
  const perfil = document.getElementById("perfil").value;
  const correo = document.getElementById("correo").value.trim().toLowerCase();
  const necesidad = document.getElementById("necesidad").value.trim();
  const interes = form.querySelector('input[name="interes"]:checked')?.value || "";
  const consentimiento = document.getElementById("consentimiento").checked;
  let valid = true;

  if (nombre.length < 2) { showError("nombre", "Escribe tu nombre (mínimo 2 caracteres)."); valid = false; }
  if (!perfil) { showError("perfil", "Selecciona tu perfil."); valid = false; }
  if (!validEmail(correo)) { showError("correo", "Introduce un correo electrónico válido."); valid = false; }
  if (necesidad.length < 8) { showError("necesidad", "Cuéntanos un poco más (mínimo 8 caracteres)."); valid = false; }
  if (!interes) { document.getElementById("interesError").textContent = "Selecciona la función que más te interesa."; valid = false; }
  if (!consentimiento) { document.getElementById("consentimientoError").textContent = "Necesitamos tu autorización para gestionar la inscripción."; valid = false; }

  if (!valid) {
    setMessage("error", "Revisa los campos señalados antes de enviar.");
    return;
  }

  const cfg = window.OBJETIVO_CONFIG || {};
  const configured = cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_URL.includes("TU-PROYECTO") &&
    !cfg.SUPABASE_ANON_KEY.includes("TU_CLAVE");

  if (!configured || !window.supabase) {
    setMessage("error", "El formulario está validado, pero falta configurar Supabase. Sigue las instrucciones del README para conectar la base de datos.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  try {
    const client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    const { error } = await client.from("inscritos_beta").insert([{
      nombre,
      correo,
      perfil,
      necesidad,
      interes
    }]);
    if (error) {
      if (error.code === "23505") {
        setMessage("error", "Este correo ya está inscrito. ¡Gracias por tu interés!");
      } else {
        console.error("Supabase insert error:", error);
        setMessage("error", "No pudimos guardar tu inscripción. Inténtalo más tarde.");
      }
      return;
    }
    form.reset();
    setMessage("success", "¡Inscripción recibida! Gracias por ayudar a construir Objetivo. Tu respuesta se guardó correctamente.");
  } catch (error) {
    console.error("Submission error:", error);
    setMessage("error", "Ocurrió un problema de conexión. Comprueba tu conexión e inténtalo nuevamente.");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Enviar inscripción <span aria-hidden="true">→</span>';
  }
});