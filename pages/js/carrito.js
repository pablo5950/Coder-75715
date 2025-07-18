//Seleccionamos todos los botones "Comprar"
const botones = document.querySelectorAll('.btnComprar');

// Array que va a tener los productos agregados al carrito
const carrito = [];

// Recupero el carrito guardado al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
  if (carritoGuardado) {
    carrito.push(...carritoGuardado);
    actualizarCarrito();
  }
});

//contenedores para mostrar el carrito y el total
const contenedor = document.getElementById('carrito');
const total = document.getElementById('total'); 
const btnVaciar = document.getElementById('btnVaciar');

//recorremos cada botón y le asignamos un evento click
botones.forEach(boton => {
  boton.addEventListener('click', (e) => {
    //Busqueda de la tarjeta de la moto,asociada al botón clickeado
    const card = e.target.closest('.motoCard');

    //Nombre y precio del producto
    const nombre = card.querySelector('.nombreMoto').textContent;
    const precioTexto = card.querySelector('.precioMoto').textContent.replace('$', '').replace('.', '');
    const precio = parseFloat(precioTexto);

    //vemos si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }

    actualizarCarrito();
  });
});

// muestra en pantalla los productos del carrito y el total
function actualizarCarrito() {
  contenedor.innerHTML = '<h3>🛒Detalle de venta:</h3>';
  let suma = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML += `<p>El carrito está vacío</p>`;
  } else {
    carrito.forEach(item => {
      contenedor.innerHTML += `<p>${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}</p>`;
      suma += item.precio * item.cantidad;
    });
  }

  total.textContent = ` El monto total de su compra es de: $${suma.toLocaleString()}`;
  guardarCarrito();
}

// guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

//vaciar el carrito
btnVaciar.addEventListener('click', () => {
  carrito.length = 0;
  actualizarCarrito();
  localStorage.removeItem('carrito');
});
