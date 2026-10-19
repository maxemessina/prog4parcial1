import express, { type Router } from "express";

export interface AppRouters {
  productos: Router;
  pedidos: Router;
  reportes: Router;
}

export function createApp({ productos, pedidos, reportes }: AppRouters) {
  const app = express();

  app.use(express.json());
  app.use("/productos", productos);
  app.use("/pedidos", pedidos);
  app.use("/reportes", reportes);
  app.use((_request, response) => {
    response.status(404).json({ error: "Ruta no encontrada" });
  });

  return app;
}