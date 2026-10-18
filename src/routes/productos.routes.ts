
import { Router } from "express";
import type { Producto } from "../models/Producto";

export interface ProductoService {
  listarProductos(): Producto[];
  obtenerProductoPorId(id: number): Producto | undefined;
}
//Esta funcion recibe el servicio desdee afuera, inyeccion de dependencias. Es decir:
// La ruta no decide como se almacenan los productos ni crea su propio catalogo.
export function TomaProductosRouter(
  productoService: ProductoService,
): Router {
  const router = Router();

  router.get("/", (_request, response) => {
    response.json(productoService.listarProductos());
  });

  router.get("/:id", (request, response) => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({
        error: "El ID debe ser un entero positivo",
      });
      return;
    }

    const producto = productoService.obtenerProductoPorId(id);

    if (!producto) {
      response.status(404).json({
        error: "Producto no encontrado",
      });
      return;
    }

    response.json(producto);
  });

  return router;
}
