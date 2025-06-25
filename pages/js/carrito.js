// Seleccionamos todos los botones "Comprar"
const botones = document.querySelectorAll('.btnComprar');

// Array que va a contener los productos agregados al carrito
const carrito = [];

// Creamos dinámicamente los contenedores para mostrar el carrito y el total
const contenedor = document.createElement('div');
const total = document.createElement('div');
contenedor.id = "carrito";
total.id = "total";

// Agregamos estos elementos al final del body
document.body.appendChild(contenedor);
document.body.appendChild(total);

// Recorremos cada botón y le asignamos un evento click
botones.forEach(boton => {
  boton.addEventListener('click', (e) => {
    // Buscamos la tarjeta de la moto asociada al botón clickeado
    const card = e.target.closest('.motoCard');

    // Extraemos el nombre y precio del producto
    const nombre = card.querySelector('.nombreMoto').textContent;
    const precioTexto = card.querySelector('.precioMoto').textContent.replace('$', '').replace('.', '');
    const precio = parseFloat(precioTexto);

    // Agregamos el producto al carrito
    carrito.push({ nombre, precio });

    // Actualizamos el contenido visible del carrito
    actualizarCarrito();
  });
});

// Función que muestra en pantalla los productos del carrito y el total
function actualizarCarrito() {
  contenedor.innerHTML = '<h3>🛒 Carrito:</h3>';
  let suma = 0;

  // Recorremos cada ítem del carrito y lo mostramos
  carrito.forEach(item => {
    contenedor.innerHTML += `<p>${item.nombre} - $${item.precio.toLocaleString()}</p>`;
    suma += item.precio;
  });

  // Mostramos el total
  total.textContent = ` Total: $${suma.toLocaleString()}`;
}
