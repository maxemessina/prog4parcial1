
import { Router } from "express";
import type { PedidoService } from "../services/pedidoService";

export function TomaReportesRouter(
  pedidoService: PedidoService,
): Router {
  const router = Router();

  router.get("/facturacion", (_request, response) => {
    response.json({
      facturacionTotal: pedidoService.calcularFacturacionTotal(),
    });
  });

  router.get("/mas-vendido", (_request, response) => {
    const producto = pedidoService.obtenerProductoMasVendido();

    if (!producto) {
      response.json({
        mensaje: "Todavía no hay ventas registradas",
        producto: null,
      });
      return;
    }

    response.json(producto);
  });

  return router;
}
