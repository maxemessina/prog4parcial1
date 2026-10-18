
import { z } from "zod";

export const pedidoSchema = z.object({
  items: z
    .array(
      z.object({
        productoId: z.number().int().positive(),
        cantidad: z.number().int().positive(),
      }),
    )
    .min(1, "El pedido debe contener al menos un producto"),
});
