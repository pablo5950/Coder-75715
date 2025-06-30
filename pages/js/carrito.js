// Seleccionamos todos los botones "Comprar"
const botones = document.querySelectorAll('.btnComprar');

// Array que va a contener los productos agregados al carrito
const carrito = [];

//contenedores para mostrar el carrito y el total
const contenedor = document.getElementById('carrito');
const total = document.getElementById('total'); 
const btnVaciar = document.getElementById('btnVaciar');


// Recorremos cada botón y le asignamos un evento click
botones.forEach(boton => {
  boton.addEventListener('click', (e) => {
    // Buscamos la tarjeta de la moto asociada al botón clickeado
    const card = e.target.closest('.motoCard');

    //Extraemos el nombre y precio del producto
    const nombre = card.querySelector('.nombreMoto').textContent;
    const precioTexto = card.querySelector('.precioMoto').textContent.replace('$', '').replace('.', '');
    const precio = parseFloat(precioTexto);

    // Agregamos el producto al carrito
    carrito.push({ nombre, precio });

    // Actualización
    actualizarCarrito();
  });
});

// Función que muestra en pantalla los productos del carrito y el total
function actualizarCarrito() {
  contenedor.innerHTML = '<h3>🛒Detalle de venta:</h3>';
  let suma = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML += `<p>El carrito está vacío</p>`;
  } else {
    carrito.forEach(item => {
      contenedor.innerHTML += `<p>${item.nombre} - $${item.precio.toLocaleString()}</p>`;
      suma += item.precio;
    });
  }

  total.textContent = ` El monto total de su compra es de: $${suma.toLocaleString()}`;
}

//vaciar el carrito 
btnVaciar.addEventListener('click', () => {
  carrito.length = 0;
  actualizarCarrito();
});
