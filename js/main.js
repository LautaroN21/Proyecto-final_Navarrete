
// Elementos del DOM
const contenedorProductos = document.querySelector('#contenedor-productos');
const selectOrdenar = document.querySelector('#ordenar-precio');
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const mostrarProductos = (data) => {
    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = ''; 
    data.forEach(producto => {
        const cardProducto = document.createElement('article');
        cardProducto.innerHTML = `
            <div class="card-container">
                <div class="card"> 
                    <div class="card-image">
                        <img id="product-img" src="${producto.img}" alt="${producto.nombre}" />
                    </div>
                    <div class="card-content">
                        <h2 class="card-nombre">${producto.nombre}</h2>
                        <p class="card-price">$${producto.price}</p>
                        <button data-id="${producto.id}" class="btn-compra">Añadir al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        contenedorProductos.appendChild(cardProducto);
    });
};

// Botones de compra
contenedorProductos?.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-compra')) {
        const productoId = e.target.getAttribute('data-id');
        agregarAlCarrito(productoId);
    }
});

// Local Storage
function agregarAlCarrito(id) {
    const prodEncontrado = productos.find(prod => prod.id === parseInt(id));

    if (prodEncontrado) {
        const productoEnCarrito = carrito.find(prod => prod.id === prodEncontrado.id);
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            prodEncontrado.cantidad = 1;
            carrito.push(prodEncontrado);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Se agregó al carrito"
          });
    } else {
        console.log("Producto no encontrado");
    }
}

const filtrarYOrdenarProductos = (criterioOrden) => {
    let productosOrdenados = [...productos];
    
    if (criterioOrden === 'menor-mayor') {
        productosOrdenados.sort((a, b) => a.price - b.price);
    } else if (criterioOrden === 'mayor-menor') {
        productosOrdenados.sort((a, b) => b.price - a.price);
    }

    mostrarProductos(productosOrdenados);
};

// Evento para ordenar productos
selectOrdenar?.addEventListener('change', (e) => {
    filtrarYOrdenarProductos(e.target.value);
});

filtrarYOrdenarProductos('menor-mayor');

function mostrarCarrito() {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    if (!listaCarrito || !totalCarrito) return;

    if (carritoGuardado.length === 0) {
        listaCarrito.innerHTML = `<p class="text-carrito">El carrito está vacío!</p>`;
        totalCarrito.textContent = `Total: $0`;
        return;
    }

    listaCarrito.innerHTML = "";
    let total = 0;

    carritoGuardado.forEach(producto => {
        const item = document.createElement("div");
        item.classList.add("cart-item", "d-flex", "justify-content-between", "align-items-center", "mb-3");
        item.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}" class="img-fluid" style="width: 50px; height: 50px;">
            <div class="item-details">
                <h5 class="m-0">${producto.nombre}</h5>
                <p class="m-0">Precio: $${producto.price}</p>
                <p class="m-0">Cantidad: ${producto.cantidad}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary btn-sm" onclick="sumarProducto(${producto.id})">+</button>
                <button class="btn btn-secondary btn-sm" onclick="eliminarProducto(${producto.id})">-</button>
            </div>
            <p class="item-total m-0">Total: $${producto.price * producto.cantidad}</p>
        `;

        listaCarrito.appendChild(item);
        total += producto.price * producto.cantidad;
    });

    totalCarrito.textContent = `Total: $${total}`;
}

function sumarProducto(id) {
    const productoEnCarrito = carrito.find(prod => prod.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }
}

function eliminarProducto(id) {
    const productoEnCarrito = carrito.find(prod => prod.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad -= 1;
        
        if (productoEnCarrito.cantidad <= 0) {
            const index = carrito.indexOf(productoEnCarrito);
            carrito.splice(index, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }
}

function alertCompra() {
    Swal.fire({
        title: "Tu compra se realizó con éxito",
        text: "¡Pronto llegará tu pedido!",
        icon: "success"
    });
}

// Escucha el evento de cambio en el Local Storage para actualizar el carrito
window.addEventListener('storage', (event) => {
    if (event.key === 'carrito') {
        mostrarCarrito();
    }
});
if (document.getElementById("finalizar-compra")) {
    document.getElementById("finalizar-compra").addEventListener("click", () => {
        const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
        
        if (carritoGuardado.length === 0) {
            Swal.fire({
                title: "Ningun producto agregado",
                text: "Para finalizar la compra debes agregar un producto.",
                icon: "error"
            });
        } else {
            alertCompra(); 
        }
    });
}

if (document.getElementById("vaciar-carrito")) {
    document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
    mostrarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

function alertCompra() {
    Swal.fire({
        title: "Tu compra se realizó con éxito",
        text: "¡Pronto llegará tu pedido!",
        icon: "success"
    });
}


