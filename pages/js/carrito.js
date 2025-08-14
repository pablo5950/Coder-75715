//Estado del carrito y catálogo
let carrito = [];
let catalogo = [];

// inicio
document.addEventListener('DOMContentLoaded', () => {
  cargarDatos();
  configurarEventosModal();
});

//  cvarga de datos desde JSON
async function cargarDatos() {
  try {
    const [motos, accesorios] = await Promise.all([
      fetch('js/motos.json').then(res => res.json()),
      fetch('js/accesorios.json').then(res => res.json())
    ]);

    catalogo = motos;
    renderizarCatalogo();
    renderizarAccesorios(accesorios);
    cargarCarritoInicial();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

//Renderizado de catálogo de motos
function renderizarCatalogo() {
  const contenedor = document.getElementById('catalogoMotos');
  contenedor.innerHTML = '';

  catalogo.forEach(moto => {
    const card = document.createElement('div');
    card.className = 'motoCard';
    card.innerHTML = `
      ${moto.oferta ? '<div class="etiquetaOferta">OFERTA</div>' : ''}
      <img src="${moto.imagen}" alt="${moto.nombre}">
      <p class="nombreMoto">${moto.nombre}</p>
      <p class="precioMoto">$${moto.precio.toLocaleString()}</p>
      <button class="btnComprar" data-id="${moto.id}">
        <i class="fa-solid fa-cart-shopping"></i> Comprar
      </button>
    `;
    contenedor.appendChild(card);
  });

  document.querySelectorAll('.btnComprar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      agregarAlCarrito(id);
    });
  });
}

//Agregar prod al carrito de compras
function agregarAlCarrito(id) {
  const producto = catalogo.find(p => p.id === id);
  if (!producto) return;

  const index = carrito.findIndex(item => item.id === id);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }

  mostrarNotificacion(`${producto.nombre} agregado`);
  actualizarCarrito();
}

function agregarAlCarritoAccesorio(producto) {
  const index = carrito.findIndex(item => item.id === producto.id);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }

  mostrarNotificacion(`${producto.nombre} agregado`);
  actualizarCarrito();
}

//Actualización y render del carrito
function actualizarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderizarCarrito();
}

function renderizarCarrito() {
  const contenedor = document.getElementById('carrito');
  const totalElement = document.getElementById('total');

  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
    totalElement.textContent = '';
    return;
  }

  carrito.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-carrito';
    div.innerHTML = `
      <img src="${item.imagen}" class="carrito-imagen" alt="${item.nombre}">
      <div>
        <p>${item.nombre}</p>
        <p>${item.cantidad} x $${item.precio.toLocaleString()}</p>
      </div>
      <button class="btnEliminar" data-id="${item.id}">❌</button>
    `;
    contenedor.appendChild(div);
  });

  totalElement.textContent = `Total: $${calcularTotal().toLocaleString()}`;

  document.querySelectorAll('.btnEliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      eliminarDelCarrito(parseInt(btn.dataset.id));
    });
  });
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarCarrito();
}

function calcularTotal() {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function cargarCarritoInicial() {
  const guardado = localStorage.getItem('carrito');
  carrito = guardado ? JSON.parse(guardado) : [];
  actualizarCarrito();
}

//Notificación visual
function mostrarNotificacion(mensaje) {
  Toastify({
    text: `🛒 ${mensaje}`,
    duration: 2000,
    gravity: "top",
    position: "right",
    style: {
      background: "#27ae60",
      color: "white"
    }
  }).showToast();
}

// Validación del formulario de compra
function validarFormulario() {
  const nombre = document.getElementById("nombre")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const direccion = document.getElementById("direccion")?.value.trim();
  const errores = [];

  if (!nombre) errores.push("⚠️ El nombre no puede estar vacío.");
  if (!email || !email.includes("@") || !email.includes(".")) errores.push("⚠️ El correo no es válido.");
  if (!direccion || direccion.length < 5) errores.push("⚠️ La dirección debe tener al menos 5 caracteres.");

  const erroresDiv = document.getElementById("errores");
  if (erroresDiv) erroresDiv.innerHTML = "";

  if (errores.length > 0) {
    errores.forEach(err => {
      const p = document.createElement("p");
      p.textContent = err;
      p.style.color = "crimson";
      erroresDiv?.appendChild(p);
    });
    return false;
  }

  return true;
}

//Eventos del modal del carrito
function configurarEventosModal() {
  document.getElementById('abrirCarrito').addEventListener('click', () => {
    document.getElementById('modalCarrito').classList.remove('oculto');
  });

  document.getElementById('cerrarCarrito').addEventListener('click', () => {
    document.getElementById('modalCarrito').classList.add('oculto');
  });

  document.getElementById('btnVaciar').addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
  });

  document.getElementById('btnFinalizar').addEventListener('click', () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Carrito vacío',
        text: 'Agregá productos antes de finalizar la compra.'
      });
      return;
    }

    if (!validarFormulario()) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor completá los datos correctamente antes de finalizar.'
      });
      return;
    }

    const total = calcularTotal();
    const nombreUsuario = document.getElementById("nombre").value.trim();
    const direccionUsuario = document.getElementById("direccion").value.trim();
    const resumen = carrito.map(item =>
      `${item.nombre} (${item.cantidad} x $${item.precio.toLocaleString()})`
    ).join('<br>');

  Swal.fire({
  icon: 'success',
  title: '¡Compra finalizada!',
  html: `
    <p>Gracias por tu compra, ${nombreUsuario}.</p>
    <p><strong>El pedido será entregado dentro de los 3 días hábiles
     a la dirección:</strong> ${direccionUsuario}</p>
    <p><strong>Resumen:</strong><br>${resumen}</p>
    <p><strong>Total:</strong> $${total.toLocaleString()}</p>
  `,
  confirmButtonText: 'Aceptar'
});

    carrito = [];
    actualizarCarrito();
    document.getElementById('modalCarrito').classList.add('oculto');
  });
}

//renderizado de los accesorios sugeridos
function renderizarAccesorios(accesorios) {
  const contenedor = document.getElementById('sugerencias');
  contenedor.innerHTML = '';

  accesorios.forEach(item => {
    const card = document.createElement('div');
    card.className = 'sugerenciaCard';
    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <h4>${item.nombre}</h4>
      <p>$${item.precio.toLocaleString()}</p>
      <button class="btnComprar" data-id="${item.id}">
        <i class="fa-solid fa-cart-shopping"></i> Comprar
      </button>
    `;
    contenedor.appendChild(card);
  });

  document.querySelectorAll('.btnComprar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const producto = accesorios.find(p => p.id === id);
      agregarAlCarritoAccesorio(producto);
    });
  });
}
