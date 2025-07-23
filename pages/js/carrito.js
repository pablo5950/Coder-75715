//seleccionamos todos los botones "Comprar"
const botones = document.querySelectorAll('.btnComprar');

//array que va a tener los productos agregados al carrito
const carrito = [];

//Recupero el carrito guardado al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
  if (carritoGuardado) {
    carrito.push(...carritoGuardado);
    actualizarCarrito();
  }
  cargarAccesorios(); //simulacipon de una api
});

// Contenedores para mostrar el carrito y el total
const contenedor = document.getElementById('carrito');
const total = document.getElementById('total'); 
const btnVaciar = document.getElementById('btnVaciar');
const btnFinalizar = document.getElementById('btnFinalizar');

//recorrer cada botón "Comprar" y agregar evento
botones.forEach(boton => {
  boton.addEventListener('click', (e) => {
    const card = e.target.closest('.motoCard');
    const nombre = card.querySelector('.nombreMoto').textContent;
    const precioTexto = card.querySelector('.precioMoto').textContent.replace('$', '').replace('.', '');
    const precio = parseFloat(precioTexto);

    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }

    Toastify({
      text: `${nombre} agregado al carrito ✅`,
      duration: 3000,
      gravity: "bottom",
      position: "center",
      style: {
      background: "#27ae60",
      color: "#fff",
      padding: "15px",
      fontSize: "18px",
      borderRadius: "8px",
      fontWeight: "bold",
      textAlign: "center",
      position: "fixed",
      bottom: "50%",
      left: "50%",
      transform: "translate(-50%, 50%)",
      zIndex: "9999"
      }
    }).showToast();

    actualizarCarrito();
  });
});

//Mostrar productos del carrito y el total
function actualizarCarrito() {
  contenedor.innerHTML = '<h3>🛒Detalle de venta:</h3>';
  let suma = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML += `<p>El carrito está vacío</p>`;
    total.textContent = '';
    localStorage.setItem('carrito', JSON.stringify(carrito));
    return;
  }

  carrito.forEach((item, index) => {
    contenedor.innerHTML += `
      <p>
        ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}
        <button class="btnEliminar" data-index="${index}">❌</button>
      </p>
    `;
    suma += item.precio * item.cantidad;
  });

  total.textContent = ` El monto total de su compra es de: $${suma.toLocaleString()}`;
  localStorage.setItem('carrito', JSON.stringify(carrito));

  document.querySelectorAll('.btnEliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      carrito.splice(index, 1);
      actualizarCarrito();
    });
  });
}

// Vaciar el carrito
btnVaciar.addEventListener('click', () => {
  carrito.length = 0;
  actualizarCarrito();
  localStorage.removeItem('carrito');
});

//finalizar compra con validación
btnFinalizar.addEventListener('click', () => {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'Agregá productos antes de finalizar la compra'
    });
    return;
  }

  Swal.fire({
    title: 'Datos del cliente 📝',
    html: `
      <input id="nombreCliente" class="swal2-input" placeholder="Nombre">
      <input id="apellidoCliente" class="swal2-input" placeholder="Apellido">
      <input id="direccionCliente" class="swal2-input" placeholder="Dirección">
      <input id="provinciaCliente" class="swal2-input" placeholder="Provincia">
      <input id="cpCliente" class="swal2-input" placeholder="Código Postal">
      <input id="telefonoCliente" class="swal2-input" placeholder="Teléfono">
      <input id="emailCliente" class="swal2-input" placeholder="Email">
    `,
    confirmButtonText: 'Confirmar pedido',
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const nombre = document.getElementById('nombreCliente').value;
      const apellido = document.getElementById('apellidoCliente').value;
      const direccion = document.getElementById('direccionCliente').value;
      const provincia = document.getElementById('provinciaCliente').value;
      const cp = document.getElementById('cpCliente').value;
      const telefono = document.getElementById('telefonoCliente').value;
      const email = document.getElementById('emailCliente').value;

      if (!nombre || !apellido || !direccion || !provincia || !cp || !telefono || !email) {
        Swal.showValidationMessage('Por favor completá todos los campos');
      }

      return { nombre, apellido, direccion, provincia, cp, telefono, email };
    }
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: '¡Pedido confirmado! 🎉',
        html: `
          <p><strong>Cliente:</strong> ${result.value.nombre} ${result.value.apellido}</p>
          <p><strong>Dirección:</strong> ${result.value.direccion}, ${result.value.provincia}, CP ${result.value.cp}</p>
          <p><strong>Teléfono:</strong> ${result.value.telefono}</p>
          <p><strong>Email:</strong> ${result.value.email}</p>
          <p>⏱️ <em>Tiempo estimado de entrega: 3 días</em></p>
        `
      });

      carrito.length = 0;
      actualizarCarrito();
      localStorage.removeItem('carrito');
      modalCarrito.classList.add('oculto'); 
    }
  });
});

//Abrir y cerrar modal del carrito
const abrirCarritoBtn = document.getElementById('abrirCarrito');
const modalCarrito = document.getElementById('modalCarrito');
const cerrarCarritoBtn = document.getElementById('cerrarCarrito');

abrirCarritoBtn.addEventListener('click', () => {
  modalCarrito.classList.remove('oculto');
});

cerrarCarritoBtn.addEventListener('click', () => {
  modalCarrito.classList.add('oculto');
});

//simular llamada a API de accesorios
function cargarAccesorios() {
  fetch('js/accesorios.json')
    .then(res => res.json())
    .then(data => {
      const sugerencias = document.getElementById('sugerencias');
      data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('sugerenciaCard');
        card.innerHTML = `
          <img src="${item.imagen}" alt="${item.nombre}">
          <h4>${item.nombre}</h4>
          <p>$${item.precio}</p>
        `;
        sugerencias.appendChild(card);
      });
    })
    .catch(err => console.error('Error cargando accesorios:', err));
}
