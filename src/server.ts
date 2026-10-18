import { Router } from "express";
import { createApp } from "./app";

function createPendingRouter(resource: string): Router {
  const router = Router();

  router.use((_request, response) => {
    response.status(503).json({
      error: `Las rutas de ${resource} todavía no están implementadas`,
    });
  });

  return router;
}

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`El puerto configurado no es válido: ${process.env.PORT}`);
}

const app = createApp({
  productos: createPendingRouter("productos"),
  pedidos: createPendingRouter("pedidos"),
  reportes: createPendingRouter("reportes"),
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});