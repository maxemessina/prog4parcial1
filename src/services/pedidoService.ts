

import type { Pedido, PedidoItem } from "../models/Pedido";
import type { ProductoService } from "./productoService";

export class PedidoService {
  private readonly pedidos: Pedido[] = [];
  private siguienteId = 1;

  constructor(
    private readonly productoService: ProductoService,
  ) {}

  crearPedido(items: PedidoItem[]): Pedido {
    const pedido: Pedido = {
      id: this.siguienteId++,
      items: items.map((item) => ({ ...item })),
      estado: "pendiente",
    };

    this.pedidos.push(pedido);

    return pedido;
  }

  listarPedidos(): Pedido[] {
    return this.pedidos.map((pedido) => ({
      ...pedido,
      items: pedido.items.map((item) => ({ ...item })),
    }));
  }

  obtenerPedidoPorId(id: number): Pedido | undefined {
    const pedido = this.pedidos.find((pedido) => pedido.id === id);

    if (!pedido) {
      return undefined;
    }

    return {
      ...pedido,
      items: pedido.items.map((item) => ({ ...item })),
    };
  }

  calcularTotalPedido(pedido: Pedido): number {
    return pedido.items.reduce((total, item) => {
      const producto = this.productoService.obtenerProductoPorId(
        item.productoId,
      );

      if (!producto) {
        throw new Error(
          `Producto con ID ${item.productoId} no encontrado`,
        );
      }

      return total + producto.calcularPrecio() * item.cantidad;
    }, 0);
  }

  calcularFacturacionTotal(): number {
    return this.pedidos.reduce(
      (total, pedido) => total + this.calcularTotalPedido(pedido),
      0,
    );
  }

  calcularUnidadesVendidas(): Record<string, number> {
    return this.pedidos.reduce<Record<string, number>>((ventas, pedido) => {
      for (const item of pedido.items) {
        const producto = this.productoService.obtenerProductoPorId(
          item.productoId,
        );

        if (!producto) {
          throw new Error(
            `Producto con ID ${item.productoId} no encontrado`,
          );
        }

        ventas[producto.nombre] =
          (ventas[producto.nombre] ?? 0) + item.cantidad;
      }

      return ventas;
    }, {});
  }

  obtenerProductoMasVendido():
    | { producto: string; cantidad: number }
    | undefined {
    const ventas = this.calcularUnidadesVendidas();

    return Object.entries(ventas).reduce<
      { producto: string; cantidad: number } | undefined
    >((mayor, [producto, cantidad]) => {
      if (!mayor || cantidad > mayor.cantidad) {
        return { producto, cantidad };
      }

      return mayor;
    }, undefined);
  }
}
