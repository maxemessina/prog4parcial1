
import { Router } from "express";
import type { Pedido, PedidoItem } from "../models/Pedido";
import type { ProductoService } from "./productos.routes";
import { pedidoSchema } from "../schemas/pedidoSchema";

 // Define las operaciones que debe ofrecer el servicio de pedidos.
export interface PedidoService {
  crearPedido(items: PedidoItem[]): Pedido;
  listarPedidos(): Pedido[];
  obtenerPedidoPorId(id: number): Pedido | undefined;
}

 // Crea las rutas de pedidos y recibe los servicios que necesita.
export function TomaPedidosRouter(
  pedidoService: PedidoService,
  productoService: ProductoService,
): Router {
  const router = Router();

  router.post("/", (request, response) => {
    const resultado = pedidoSchema.safeParse(request.body);

 // Si los datos no son válidos, devuelve un error 400
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

 // Comprueba que todos los productos del pedido existan.
    for (const item of items) {
      const producto = productoService.obtenerProductoPorId(
        item.productoId,
      );

 // Si algún producto no existe, rechaza el pedido.
      if (!producto) {
        response.status(400).json({
          error: `No existe el producto con ID ${item.productoId}`,
        });
        return;
      }
    }

 // Delega la creación del pedido al servicio correspondiente.
    const pedido = pedidoService.crearPedido(items);
 // Devuelve el pedido creado con el estado HTTP 201.
    response.status(201).json(pedido);
  });
 // Devuelve todos los pedidos registrados.
  router.get("/", (_request, response) => {
    response.json(pedidoService.listarPedidos());
  });
 // Busca y devuelve un pedido específico por su ID.
  router.get("/:id", (request, response) => {
    const id = Number(request.params.id);
 // Verifica que el ID sea un entero positivo.
    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({
        error: "El ID debe ser un entero positivo",
      });
      return;
    }

    const pedido = pedidoService.obtenerPedidoPorId(id);

 // Consulta el pedido mediante el servicio
    const pedido = pedidoService.obtenerPedidoPorId(id);
 // Si no existe, devuelve un error 404.
    if (!pedido) {
      response.status(404).json({
        error: "Pedido no encontrado",
      });
      return;
    }

 // Devuelve el pedido encontrado.
    response.json(pedido);
  });

  return router;
}
