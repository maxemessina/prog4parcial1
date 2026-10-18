

import { describe, expect, it } from "vitest";
import { Muffin } from "../../src/models/Muffin";
import { ProductoServiceMemoria } from "../../src/services/productoService";
import { PedidoService } from "../../src/services/pedidoService";

describe("PedidoService", () => {
  const productos = new ProductoServiceMemoria([new Muffin(1)]);

  it("calcula el total de un pedido", () => {
    const service = new PedidoService(productos);

    const pedido = service.crearPedido([
      { productoId: 1, cantidad: 3 },
    ]);

    expect(service.calcularTotalPedido(pedido)).toBe(7500);
  });

  it("calcula la facturación total de los pedidos", () => {
    const service = new PedidoService(productos);

    service.crearPedido([{ productoId: 1, cantidad: 2 }]);
    service.crearPedido([{ productoId: 1, cantidad: 3 }]);

    expect(service.calcularFacturacionTotal()).toBe(12500);
  });

  it("calcula las unidades vendidas por producto", () => {
    const service = new PedidoService(productos);

    service.crearPedido([{ productoId: 1, cantidad: 2 }]);
    service.crearPedido([{ productoId: 1, cantidad: 3 }]);

    expect(service.calcularUnidadesVendidas()).toEqual({
      "Muffin de chocolate": 5,
    });
  });

  it("obtiene el producto más vendido", () => {
    const service = new PedidoService(productos);

    service.crearPedido([{ productoId: 1, cantidad: 2 }]);
    service.crearPedido([{ productoId: 1, cantidad: 3 }]);

    expect(service.obtenerProductoMasVendido()).toEqual({
      producto: "Muffin de chocolate",
      cantidad: 5,
    });
  });

  it("devuelve undefined cuando no hay ventas", () => {
    const service = new PedidoService(productos);

    expect(service.obtenerProductoMasVendido()).toBeUndefined();
  });
});
