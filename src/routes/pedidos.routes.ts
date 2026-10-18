
import { Router } from "express";
import type { Pedido, PedidoItem } from "../models/Pedido";
import type { ProductoService } from "./productos.routes";
import { pedidoSchema } from "../schemas/pedidoSchema";

export interface PedidoService {
  crearPedido(items: PedidoItem[]): Pedido;
  listarPedidos(): Pedido[];
  obtenerPedidoPorId(id: number): Pedido | undefined;
}

export function TomaPedidosRouter(
  pedidoService: PedidoService,
  productoService: ProductoService,
): Router {
  const router = Router();

  router.post("/", (request, response) => {
    const resultado = pedidoSchema.safeParse(request.body);

    if (!resultado.success) {
      response.status(400).json({
        error: "Datos del pedido inválidos",
        detalles: resultado.error.issues.map((issue) => ({
          campo: issue.path.join("."),
          mensaje: issue.message,
        })),
      });
      return;
    }

    const { items } = resultado.data;

    for (const item of items) {
      const producto = productoService.obtenerProductoPorId(
        item.productoId,
      );

      if (!producto) {
        response.status(400).json({
          error: `No existe el producto con ID ${item.productoId}`,
        });
        return;
      }
    }

    const pedido = pedidoService.crearPedido(items);

    response.status(201).json(pedido);
  });

  router.get("/", (_request, response) => {
    response.json(pedidoService.listarPedidos());
  });

  router.get("/:id", (request, response) => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({
        error: "El ID debe ser un entero positivo",
      });
      return;
    }

    const pedido = pedidoService.obtenerPedidoPorId(id);

    if (!pedido) {
      response.status(404).json({
        error: "Pedido no encontrado",
      });
      return;
    }

    response.json(pedido);
  });

  return router;
}
