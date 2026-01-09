# 🌿 La Galería de las Plantas

Web de e-commerce para un vivero, diseñada para ser rápida y fácil de administrar.

**🔗 Ver la web funcionando:** https://simonfabrizio.github.io/la-galeria-de-las-plantas/

## 📝 Sobre el proyecto
La idea principal de este proyecto era resolver un problema real: **¿Cómo puede un negocio chico administrar su catálogo web sin pagar servidores costosos ni saber programar?**

La solución fue conectar la web directamente a una **Google Sheet**. Así, el dueño del vivero puede cambiar precios, pausar productos sin stock o subir fotos nuevas desde la app de Excel en su celular, y la web se actualiza sola.

## 🚀 Lo que hace la página
* **Catálogo Vivo:** Lee los datos (productos, precios, fotos) desde un archivo CSV de Google Drive.
* **Carrito de Compras:** Los productos se guardan en el navegador (LocalStorage), así que si recargás la página, no perdés el pedido.
* **Pedidos por WhatsApp:** Al finalizar, genera un mensaje automático con el detalle del pedido listo para enviar.
* **Filtros y Búsqueda:** Se puede ordenar por precio, buscar por nombre o filtrar por categoría (Plantas, Macetas, etc.).
* **Stock Real:** Si en el Excel el stock es 0, el botón de compra se bloquea automáticamente.

## 🛠 Tecnologías que usé
No usé frameworks pesados, quería practicar las bases:
* **HTML5 & CSS3:** Diseño propio, responsive (se adapta a celu y PC) y con variables CSS para el modo oscuro.
* **JavaScript (Vanilla):** Toda la lógica del carrito, el consumo de la API (Fetch) y el renderizado del DOM es JS puro.
* **Google Sheets:** Usado como base de datos (Backend-less).

---
Desarrollado por **Simón Fabrizio** | Estudiante de Ingeniería en Sistemas (UTN).
