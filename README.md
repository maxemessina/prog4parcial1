# Parcial 1 - API REST de Cafetería Origen

API para consultar productos, registrar pedidos y obtener reportes de ventas
de la cafetería Origen. La solución aplica los contenidos de la materia sobre
objetos, TypeScript, separación por capas, validación y testing.

## Requisitos del proyecto

- Productos: café expreso, café filtrado y pastelería (muffin de chocolate y
  porción de torta selva negra).
- Los cafés se ofrecen en tres tamaños y tres variedades. Su precio es el
  precio base de la preparación más los gramos de café por tamaño multiplicados
  por el precio por gramo de la variedad. Los valores exactos están en
  [consigna.md](./consigna.md).
- Cada producto implementa `calcularPrecio()`.
- Los pedidos contienen un identificador, items con `productoId` y `cantidad`,
  y un estado.
- La lógica permite obtener el total de cada pedido, la facturación total, las
  cantidades vendidas por producto y el producto más vendido.
- La API expone:
  - `GET /productos` y `GET /productos/:id`
  - `POST /pedidos`, `GET /pedidos` y `GET /pedidos/:id`
  - `GET /reportes/facturacion` y `GET /reportes/mas-vendido`

## Decisiones de diseño

- **Separación entre `app.ts` y `server.ts`:** `app.ts` configura Express y
  recibe los routers; no abre un puerto. `server.ts` ensambla las dependencias
  y arranca el servidor. Esto permite probar la aplicación HTTP sin iniciar un
  servidor real.
- **Inyección de dependencias:** la aplicación recibe sus routers y estos
  pueden recibir los servicios que utilizan. Así, cada capa se puede sustituir
  por una implementación controlada durante las pruebas.
- **POO y polimorfismo:** `Producto` define el contrato abstracto
  `calcularPrecio()`. Las preparaciones de café y los productos de pastelería
  implementan ese contrato con su propia regla de precio. Tamaños y variedades
  son datos tipados de las instancias, no clases para cada combinación.
- **Validación en el borde:** Zod valida las entradas HTTP antes de que lleguen
  a la lógica de negocio.
- **Responsabilidad de cada capa:** los modelos representan el dominio, los
  servicios resuelven reglas de negocio y las rutas traducen solicitudes y
  respuestas HTTP.
- **Testing:** se usan pruebas unitarias para modelos y servicios, y pruebas de
  integración para verificar las rutas. Las pruebas se organizan con el patrón
  Arrange, Act, Assert y, cuando corresponda, siguiendo TDD.

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
  integration/
package.json
tsconfig.json
vitest.config.ts
```

## División de tareas

La división incluye implementación y validación funcional.

### Máximo Messina - Arquitectura, dominio y pedidos

- **Completado:** configuración inicial del proyecto, dependencias, scripts,
  TypeScript estricto y configuración de Vitest.
- **Completado:** `app.ts` separado del arranque, con inyección de los routers.
  `server.ts` valida el puerto y arranca el servidor. Hasta que existan las
  rutas definitivas, el servidor usa routers provisionales que responden `503`.
- **Completado:** clase abstracta `Producto`, con `id`, `nombre` y `precioBase`
  de solo lectura y el método abstracto `calcularPrecio()`.
- **Completado:** subclases `CafeExpreso`, `CafeFiltrado`, `Muffin` y
  `TortaSelvaNegra`, con cálculos basados en los precios de la consigna.
- **Completado:** tipos `Pedido` y `PedidoItem`, con la estructura de pedido
  establecida en la consigna.
- **En espera de coordinación:** implementar `PedidoService` para calcular el
  total de cada pedido, la facturación, las cantidades vendidas por producto y
  el producto más vendido. Acordar antes con Integrante 2 y el Integrante 4
  las interfaces de los servicios de pedidos y catálogo que consumirá.
- **En espera de Integrante 2:** conectar en `server.ts` los routers
  definitivos cuando estén implementados.

### Integrante 2 - Validación y rutas de productos y pedidos

- Definir en `pedidoSchema.ts` los esquemas Zod para validar los datos de
  entrada de `POST /pedidos`, incluyendo items y cantidades positivas.
- Implementar las rutas `GET /productos` y `GET /productos/:id`; responder
  `404` cuando el producto no exista.
- Implementar `POST /pedidos`, `GET /pedidos` y `GET /pedidos/:id`, incluyendo
  respuestas `400` para entradas inválidas y `404` cuando corresponda.
- Inyectar los servicios necesarios en los routers, sin acceder a singletons
  globales.

### Integrante 3 - Reportes y pruebas unitarias

- Implementar `GET /reportes/facturacion` y
  `GET /reportes/mas-vendido`, consumiendo `PedidoService`.
- Crear las pruebas unitarias de modelos y servicios en `tests/unit/`.
- Cubrir precios de las subclases, cálculos de pedidos, facturación, ventas
  por producto y producto más vendido, incluidos casos límite relevantes.
- Mantener aisladas las pruebas y usar dobles o mocks solo cuando ayuden a
  probar una unidad sin acoplarla a otra capa.

### Integrante 4 - Catálogo y pruebas de integración

- Implementar `productoService.ts` como catálogo en memoria de todos los
  productos requeridos por la consigna, asignándoles identificadores estables
  y sin duplicar la lógica de precio que pertenece a los modelos.
- Crear las pruebas de integración en `tests/integration/` con Supertest para
  los endpoints de productos, pedidos y reportes.
- Verificar tanto los flujos exitosos como errores de validación, recursos
  inexistentes y colecciones vacías, según el contrato acordado entre rutas y
  servicios.
- Ejecutar la suite y el reporte de cobertura; coordinar con el equipo los
  ajustes de cobertura que correspondan. La implementación de endpoints y
  lógica sigue siendo responsabilidad de quienes los tienen asignados.

### Coordinación entre tareas

- Integrante 4 acuerda con Máximo los identificadores y la composición del
  catálogo para que pedidos y reportes cuenten las ventas por producto de
  forma consistente.
- Integrante 2 acuerda con Máximo la interfaz de `PedidoService` y con
  Integrante 4 la interfaz de `productoService` antes de conectar las rutas.
- Integrante 3 acuerda con Máximo la interfaz del servicio de pedidos antes de
  implementar los reportes y las pruebas unitarias.
- Cada integrante comparte con el resto el contrato público de los módulos
  que implemente para evitar incompatibilidades al integrar.

## Instalación y comandos

Se requiere Node.js y npm.

```bash
npm ci
npm run dev
```

| Comando | Uso |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en el puerto 3000 o en el indicado por `PORT`. |
| `npm run build` | Compila TypeScript en `dist/`. |
| `npm start` | Inicia el servidor compilado. |
| `npm test` | Ejecuta las pruebas con Vitest. |
| `npm run test:watch` | Ejecuta Vitest en modo watch. |
| `npm run coverage` | Ejecuta las pruebas y genera el reporte de cobertura. |
| `npm run typecheck` | Comprueba los tipos sin generar archivos. |

Mientras las rutas reales estén pendientes de integración, los routers
provisionales responden `503`; esa respuesta indica que el endpoint todavía no
está implementado.
