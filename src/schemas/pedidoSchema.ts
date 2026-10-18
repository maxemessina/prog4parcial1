
import { z } from "zod";

// El ID del producto y la cantidad deben ser enteros positivos.
// El pedido debe contener al menos un producto.
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
