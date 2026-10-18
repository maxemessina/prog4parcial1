# Planificación y División de Tareas - Parcial 1 (API REST Pastelería)

Este documento detalla la estructura, decisiones arquitectónicas y división de tareas para el desarrollo de la API REST de la pastelería, basándose estrictamente en los conceptos teóricos y buenas prácticas enseñadas en la materia (POO, Arquitectura, Testing y Validaciones).

---

## 1. Decisiones Arquitectónicas (Fundamentación Teórica)

Para garantizar un código limpio, testeable y mantenible, aplicaremos los siguientes conceptos vistos en clase:

*   **Separación de `app.ts` y `server.ts`:** Como indica la teoría, `app.ts` configurará Express/Fastify (rutas, middlewares, dependencias) y se exportará sin hacer `listen`. `server.ts` será el único encargado de arrancar el servidor. Esto es **crítico** para poder hacer tests de integración sin abrir puertos reales (usando Supertest o `app.inject()`).
*   **Inyección de Dependencias:** Evitaremos los *singletons* globales en las rutas. Usaremos patrones como `makePedidosRouter(service)` para poder inyectar un repositorio o servicio mockeado durante los tests unitarios y de integración.
*   **Programación Orientada a Objetos (POO):** Usaremos una **Clase Abstracta** `Producto` para definir el contrato base (incluyendo propiedades con `readonly` para los IDs y el método abstracto `calcularPrecio()`). Las subclases (`Muffin`, `TortaSelvaNegra`) aplicarán **Polimorfismo** sobrescribiendo (`override`) este método.
*   **Validación en los bordes:** Utilizaremos **Zod** para validar el body del `POST /pedidos`, garantizando que la lógica de negocio solo reciba datos tipados y seguros.
*   **TDD y Pirámide de Testing:** El desarrollo debe guiarse por pruebas (TDD: Rojo, Verde, Refactor). Priorizaremos muchos tests unitarios rápidos para los servicios y modelos, y tests de integración para las rutas, midiendo la cobertura (thresholds sugeridos: >70%).

---

## 2. Estructura de Archivos del Proyecto

```text
/
├── src/
│   ├── app.ts                 # Configuración de la app (Express/Fastify + Zod)
│   ├── server.ts              # Punto de entrada (listen)
│   ├── models/
│   │   ├── Producto.ts        # Clase abstracta base
│   │   ├── Muffin.ts          # Subclase (hereda de Producto)
│   │   ├── Torta.ts           # Subclase (hereda de Producto)
│   │   └── Pedido.ts          # Clase/Tipo para los pedidos
│   ├── schemas/
│   │   └── pedidoSchema.ts    # Validaciones de Zod para el POST
│   ├── services/
│   │   ├── productoService.ts # Lógica de catálogo en memoria
│   │   └── pedidoService.ts   # Lógica de facturación, totales y más vendidos
│   └── routes/
│       ├── productos.routes.ts
│       ├── pedidos.routes.ts
│       └── reportes.routes.ts
├── tests/
│   ├── unit/                  # Tests aislados de POO y Servicios (Vitest/Jest)
│   └── integration/           # Tests de rutas HTTP (Supertest / app.inject)
├── package.json
├── tsconfig.json
└── vitest.config.ts (o jest.config.ts)
```

---

## 3. División de Tareas para 4 Integrantes

### 👤 Máximo Messina - Arquitectura Core y Lógica de Negocio (Prioridad Alta)
*   **Setup Inicial:** Crear el repositorio, configurar `tsconfig.json` (modo estricto), e instalar dependencias (Express/Fastify, TypeScript, Vitest, Zod).
*   **Arquitectura Base:** Crear `app.ts` y `server.ts` implementando la inyección de dependencias recomendada.
*   **Dominio y POO (Models):** 
    *   Crear la clase abstracta `Producto` con sus modificadores de acceso (`private`, `readonly` para IDs) y el método abstracto `calcularPrecio()`.
    *   Crear las subclases `Muffin` y `TortaSelvaNegra` usando la palabra clave `override` para sus cálculos específicos de precio.
*   **Lógica Compleja (Services):**
    *   Desarrollar el `PedidoService`. Acá vas a usar métodos de array funcionales (`reduce`, `map`, `filter`) para calcular el **total de un pedido** (sumando los `calcularPrecio()`), la **facturación total**, y el algoritmo para agrupar ventas y determinar el **producto más vendido**.

### 👤 Tomas Astudillo - Controladores, Rutas y Validación
*Se encarga de exponer la lógica de negocio al exterior de forma segura.*
*   **Schemas (Zod):** Crear el esquema de validación para `POST /pedidos` (asegurando que `items` sea un array, que `productoId` exista, y que `cantidad` sea un entero positivo).
*   **Rutas de Productos:** Implementar `GET /productos` y `GET /productos/:id`. Ante un ID inexistente, debe devolver `404 Not Found`.
*   **Rutas de Pedidos:** Implementar `POST /pedidos` (usando el esquema Zod y manejando errores `400 Bad Request`), `GET /pedidos` y `GET /pedidos/:id`.

### 👤 Integrante 3 - Reportes y Testing Unitario
*Asegura la calidad interna y termina los endpoints de reportes.*
*   **Rutas de Reportes:** Implementar `GET /reportes/facturacion` y `GET /reportes/mas-vendido` conectándolos con el `PedidoService` del Integrante 1.
*   **Testing Unitario (TDD):** Configurar el framework (ej. Vitest) y crear las suites en `tests/unit/`.
    *   Testear exhaustivamente que el polimorfismo de `calcularPrecio()` funcione bien en las subclases.
    *   Testear los cálculos complejos del `PedidoService` (Patrón AAA: Arrange, Act, Assert). Aislar los tests usando dependencias limpias por cada `it()`.

### 👤 Integrante 4 - Testing de Integración y Preparación de Entrega
*Prueba el sistema completo simulando a un usuario real y coordina la demo.*
*   **Testing de Integración:** Crear la suite en `tests/integration/` usando Supertest o `app.inject()`. Probar los "happy paths" (Ej: crear un pedido retorna 201) y los casos de error (Ej: crear un pedido sin items retorna 400 y mensaje de error claro).
*   **Medición de Cobertura:** Configurar el script de `coverage` y asegurarse de que el proyecto cumpla con métricas aceptables (revisar líneas rojas en el reporte HTML).
*   **Demo y Video:** Preparar la colección de Postman (o comandos cURL) listos para la demostración en vivo. Coordinar el guion del video (5-8 min) asegurando que todos hablen, hacer la recorrida de código y la ejecución de `npm test`.

---

## 4. Instrucciones para arrancar (Paso a Paso del Integrante 1)

1.  **Inicialización:** Abre la terminal en una carpeta vacía y ejecuta:
    ```bash
    npm init -y
    npm i express zod
    npm i -D typescript @types/node @types/express ts-node-dev vitest supertest @types/supertest
    npx tsc --init
    ```
2.  **Ajuste del `tsconfig.json`:** Asegúrate de tener `"strict": true` y definir `"outDir": "./dist"`.
3.  **Scripts en `package.json`:**
    ```json
    "scripts": {
      "dev": "ts-node-dev src/server.ts",
      "test": "vitest run",
      "test:watch": "vitest",
      "coverage": "vitest run --coverage",
      "typecheck": "tsc --noEmit"
    }
    ```
4.  **Subida inicial:** Haz tu primer commit con esta estructura base vacía y pasale el link del repo a tu equipo para que clonen y comiencen.
