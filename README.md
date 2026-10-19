# Parcial 1 - API REST de Cafetería Origen

API REST para consultar el catálogo de Origen, registrar pedidos y consultar
reportes de ventas. El proyecto aplica POO, TypeScript, validación de datos,
separación por capas y pruebas unitarias y de integración.

## Funcionalidad

- Catálogo en memoria con 20 productos:
  - 9 cafés expresos: tres tamaños y tres variedades.
  - 9 cafés filtrados: tres tamaños y tres variedades.
  - Muffin de chocolate y porción de torta selva negra.
- Los precios se calculan con los valores de la
  [consigna](./consigna.md): precio base más gramos utilizados por precio por
  gramo; pastelería usa el precio fijo indicado.
- Pedidos con identificador, items (`productoId`, `cantidad`), estado y total
  calculado al crearlos.
- Reportes de facturación total, unidades vendidas por producto y producto
  más vendido.
- Los datos se mantienen en memoria: los pedidos se reinician al reiniciar el
  servidor.

## Endpoints

| Método | Ruta | Función |
|---|---|---|
| `GET` | `/productos` | Lista el catálogo. |
| `GET` | `/productos/:id` | Busca un producto por ID. |
| `POST` | `/pedidos` | Valida y crea un pedido; responde con el pedido y su total. |
| `GET` | `/pedidos` | Lista los pedidos registrados. |
| `GET` | `/pedidos/:id` | Busca un pedido por ID. |
| `GET` | `/reportes/facturacion` | Devuelve la facturación total. |
| `GET` | `/reportes/mas-vendido` | Devuelve el producto más vendido, o informa si aún no hay ventas. |

Los IDs inválidos o recursos inexistentes reciben respuestas de error HTTP
apropiadas; Zod valida el contenido de `POST /pedidos`.

## Organización y decisiones de diseño

- `src/app.ts` configura Express, middleware JSON y routers inyectados sin
  abrir un puerto. `src/server.ts` instancia los servicios, conecta los
  routers y arranca el servidor.
- `Producto` es una clase abstracta con propiedades de solo lectura y el
  contrato `calcularPrecio()`. `CafeExpreso`, `CafeFiltrado`, `Muffin` y
  `TortaSelvaNegra` calculan su precio mediante polimorfismo.
- Tamaños y variedades de café son tipos de TypeScript y datos de instancia,
  no subclases por cada combinación.
- `ProductoService` construye el catálogo en memoria. `PedidoService`
  concentra creación de pedidos, cálculo de totales y reportes de ventas.
- Las rutas reciben los servicios que necesitan; así se separa HTTP de las
  reglas de negocio y se facilita probar cada capa.
- `pedidoSchema.ts` valida los datos externos antes de procesarlos.

## Estructura

```text
src/
  app.ts
  server.ts
  models/
    Producto.ts
    Cafe.ts
    CafeExpreso.ts
    CafeFiltrado.ts
    Muffin.ts
    Torta.ts
    Pedido.ts
  schemas/
    pedidoSchema.ts
  services/
    productoService.ts
    pedidoService.ts
  routes/
    productos.routes.ts
    pedidos.routes.ts
    reportes.routes.ts
tests/
  unit/
    pedidoService.test.ts
    productos.test.ts
  integration/
    app.test.ts
```

## División de tareas y estado

Las tareas de implementación están completadas e integradas en `dev`.

### Máximo Messina - Arquitectura, dominio y pedidos

- Separación de `app.ts` y `server.ts`, montaje de routers mediante inyección
  de dependencias y arranque del servidor.
- Modelo abstracto `Producto`, modelos concretos para las cuatro familias de
  productos y tipos `Pedido`/`PedidoItem`.
- `PedidoService`: creación de pedidos, cálculo de totales, facturación,
  unidades vendidas y producto más vendido.

### Tomás Astudillo - Validación y rutas de productos y pedidos

- Esquema Zod para validar los pedidos entrantes.
- Rutas de consulta de productos y creación/listado/búsqueda de pedidos,
  incluyendo validación de IDs y respuestas para errores.

### Valentina Guerrieri - Reportes y pruebas unitarias

- Rutas de facturación y producto más vendido.
- Pruebas unitarias para los precios de productos y los cálculos del
  `PedidoService`.

### Priscila Arrimada - Catálogo y pruebas de integración

- Catálogo en memoria con los productos y variantes requeridos.
- Pruebas de integración con Supertest para productos, pedidos y reportes.

## Instalación y comandos

Se requiere Node.js y npm. Desde la raíz del proyecto:

```bash
npm ci
npm run dev
```

El servidor escucha en el puerto `3000` de forma predeterminada; se puede
configurar otro puerto con la variable de entorno `PORT`.

| Comando | Función |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Compila TypeScript en `dist/`. |
| `npm start` | Inicia el servidor compilado. |
| `npm test` | Ejecuta las pruebas con Vitest. |
| `npm run test:watch` | Ejecuta Vitest en modo watch. |
| `npm run coverage` | Ejecuta las pruebas y muestra el reporte de cobertura. |
| `npm run typecheck` | Comprueba los tipos sin generar archivos. |