
import { createApp } from "./app";
import { ProductoServiceMemoria } from "./services/productoService";
import { PedidoService } from "./services/pedidoService";
import { TomaProductosRouter } from "./routes/productos.routes";
import { TomaPedidosRouter } from "./routes/pedidos.routes";
import { TomaReportesRouter } from "./routes/reportes.routes";

const productoService = new ProductoServiceMemoria();
const pedidoService = new PedidoService(productoService);

const app = createApp({
  productos: TomaProductosRouter(productoService),
  pedidos: TomaPedidosRouter(pedidoService, productoService),
  reportes: TomaReportesRouter(pedidoService),
});

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`El puerto configurado no es válido: ${process.env.PORT}`);
}

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
