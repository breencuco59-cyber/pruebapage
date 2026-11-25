// ====== EDITA AQUÍ LOS DATOS DE LA FIESTA ======
// Lo que dejes vacío ("" o []) no se muestra en la página.
const fiesta = {
    titulo: "¡Estás invitado a mi cumpleaños!",
    nombre: "Lilith Athenea Saldaña Vazquez",
    edad: "",                         // Ej: "¡Cumplo 7 años!"
    mensaje: "La felicidad se multiplica cuando la compartimos. Quiero que seas parte de este día tan especial.",

    fecha: "Sábado 27 de febrero de 2027",        // Texto que se ve, Ej: "Sábado 14 de marzo de 2027"
    fechaCuenta: "2027-02-27T14:00:00",                  // Para la cuenta regresiva: "2027-03-14T16:00:00"
    hora: "2:00 p.m.",
    lugar: "Salón de eventos",
    direccion: "Toca el botón para ver la ubicación en Google Maps",
    ubicacionUrl: "https://share.google/U6Lsgq3PoPR22QxkC",
    iglesiaUrl: "https://share.google/L8tuaSyqaujXzcEBt", // Ubicación de la iglesia
                    // Enlace de Google Maps para el botón "Ver ubicación"

    padres: [],                       // Ej: ["Nombre Apellido", "Nombre Apellido"]
    vestimenta: "",                   // Ej: "Casual"
    regalos: "",                      // Ej: "Lluvia de sobres"
    lugaresReservados: "",            // Ej: "2"

    mensajeFinal: "¡No faltes!",
    musica: ""                        // Ej: "audio/cancion.mp3" (guarda el archivo en una carpeta audio)
};
// ===============================================

const colores = ["#ffb8d4", "#d6c4f7", "#c3f0e0", "#fff1b0", "#bfd8ff"];
const $ = (id) => document.getElementById(id);

// Pone texto en un elemento; si no hay texto, lo oculta.
function poner(id, texto, ocultarId) {
    const el = $(id);
    const caja = $(ocultarId || id);
    if (texto) {
        el.textContent = texto;
        caja.hidden = false;
    } else {
        caja.hidden = true;
    }
}

// ----- Contenido -----
$("titulo").textContent = fiesta.titulo;
$("d-nombre").textContent = fiesta.nombre;
$("intro-nombre").textContent = fiesta.nombre;
$("d-nombre-final").textContent = fiesta.nombre;
$("d-fecha").textContent = fiesta.fecha;
$("d-hora").textContent = fiesta.hora;
$("d-lugar").textContent = fiesta.lugar;
$("d-direccion").textContent = fiesta.direccion;

poner("d-edad", fiesta.edad);
poner("d-mensaje", fiesta.mensaje);
poner("d-vestimenta", fiesta.vestimenta, "vestimenta");
poner("d-regalos", fiesta.regalos, "regalos");
poner("d-final", fiesta.mensajeFinal);

if (fiesta.lugaresReservados) {
    $("d-lugares").textContent = "Hemos reservado " + fiesta.lugaresReservados + " lugares para ti";
    $("d-lugares").hidden = false;
}

if (fiesta.ubicacionUrl) {
    $("d-mapa-link").href = fiesta.ubicacionUrl;
    $("d-mapa-link").hidden = false;
}

if (fiesta.iglesiaUrl) {
    $("d-iglesia-link").href = fiesta.iglesiaUrl;
    $("iglesia").hidden = false;
}

if (fiesta.padres.length) {
    const contenedor = $("d-padres");
    fiesta.padres.forEach((nombre) => {
        const p = document.createElement("p");
        p.textContent = nombre;
        contenedor.appendChild(p);
    });
    $("padres").hidden = false;
}

// ----- Cuenta regresiva -----
if (fiesta.fechaCuenta) {
    const meta = new Date(fiesta.fechaCuenta).getTime();
    if (!isNaN(meta)) {
        $("cuenta").hidden = false;
        const actualizar = () => {
            let resto = Math.max(0, meta - Date.now());
            const dias = Math.floor(resto / 86400000);
            resto -= dias * 86400000;
            const horas = Math.floor(resto / 3600000);
            resto -= horas * 3600000;
            const min = Math.floor(resto / 60000);
            const seg = Math.floor((resto - min * 60000) / 1000);
            $("c-dias").textContent = dias;
            $("c-horas").textContent = horas;
            $("c-min").textContent = min;
            $("c-seg").textContent = seg;
        };
        actualizar();
        setInterval(actualizar, 1000);
    }
}

// ----- Confeti -----
const lienzo = $("confeti");
const ctx = lienzo.getContext("2d");
let piezas = [];
let animando = false;
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ajustar() {
    lienzo.width = window.innerWidth;
    lienzo.height = window.innerHeight;
}
ajustar();
window.addEventListener("resize", ajustar);

function lanzarConfeti(x, y) {
    for (let i = 0; i < 90; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const fuerza = 5 + Math.random() * 9;
        piezas.push({
            x, y,
            vx: Math.cos(angulo) * fuerza,
            vy: Math.sin(angulo) * fuerza - 6,
            w: 6 + Math.random() * 7,
            h: 4 + Math.random() * 6,
            giro: Math.random() * Math.PI,
            vgiro: (Math.random() - 0.5) * 0.4,
            color: colores[Math.floor(Math.random() * colores.length)],
            vida: 110 + Math.random() * 50
        });
    }
    if (!animando) {
        animando = true;
        requestAnimationFrame(dibujar);
    }
}

function dibujar() {
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    piezas = piezas.filter(p => p.vida > 0 && p.y < lienzo.height + 20);
    for (const p of piezas) {
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.giro += p.vgiro;
        p.vida--;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.giro);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    }
    if (piezas.length) {
        requestAnimationFrame(dibujar);
    } else {
        animando = false;
        ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    }
}

// ----- Música -----
let audio = null;
const botonMusica = $("musica");

function marcarMusica(sonando) {
    botonMusica.classList.toggle("sonando", sonando);
    botonMusica.setAttribute("aria-label", sonando ? "Pausar música" : "Reproducir música");
}

if (fiesta.musica) {
    audio = new Audio(fiesta.musica);
    audio.loop = true;
    botonMusica.hidden = false;
    botonMusica.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().then(() => marcarMusica(true)).catch(() => {});
        } else {
            audio.pause();
            marcarMusica(false);
        }
    });
}

// ----- Pantalla de entrada -----
const intro = $("intro");
const entrar = $("entrar");
entrar.focus({ preventScroll: true });

entrar.addEventListener("click", () => {
    intro.classList.add("abierto");
    document.body.classList.remove("bloqueado");
    window.scrollTo(0, 0);
    if (audio) {
        audio.play().then(() => marcarMusica(true)).catch(() => {});
    }
    if (!sinMovimiento) {
        lanzarConfeti(window.innerWidth / 2, window.innerHeight * 0.55);
    }
});

// ----- Botón del banner -----
const boton = $("botonplim");
boton.addEventListener("click", () => {
    boton.classList.remove("salto");
    void boton.offsetWidth;
    boton.classList.add("salto");
    if (!sinMovimiento) {
        const r = boton.getBoundingClientRect();
        lanzarConfeti(r.left + r.width / 2, r.top + Math.min(r.height * 0.3, window.innerHeight * 0.3));
    }
});
