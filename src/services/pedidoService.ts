

import type { Pedido, PedidoConTotal, PedidoItem } from "../models/Pedido";
import type { Producto } from "../models/Producto";
import type { ProductoService } from "./productoService";

export class PedidoService {
  private readonly pedidos: Pedido[] = [];
  private siguienteId = 1;

  constructor(
    private readonly productoService: ProductoService,
  ) {}

  crearPedido(items: PedidoItem[]): PedidoConTotal {
    const pedido: Pedido = {
      id: this.siguienteId,
      items: items.map((item) => ({ ...item })),
      estado: "pendiente",
    };

    const total = this.calcularTotalPedido(pedido);
    this.pedidos.push(pedido);
    this.siguienteId++;

    return {
      ...this.copiarPedido(pedido),
      total,
    };
  }

  listarPedidos(): Pedido[] {
    return this.pedidos.map((pedido) => this.copiarPedido(pedido));
  }

  obtenerPedidoPorId(id: number): Pedido | undefined {
    const pedido = this.pedidos.find((pedido) => pedido.id === id);

    if (!pedido) {
      return undefined;
    }

    return this.copiarPedido(pedido);
  }

  calcularTotalPedido(pedido: Pedido): number {
    return pedido.items.reduce((total, item) => {
      const producto = this.obtenerProducto(item.productoId);
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
    return this.pedidos.reduce<Record<string, number>>(
      (ventas, pedido) =>
        pedido.items.reduce((acumulado, item) => {
          const producto = this.obtenerProducto(item.productoId);
          acumulado[producto.nombre] =
            (acumulado[producto.nombre] ?? 0) + item.cantidad;
          return acumulado;
        }, ventas),
      {},
    );
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

  private copiarPedido(pedido: Pedido): Pedido {
    return {
      ...pedido,
      items: pedido.items.map((item) => ({ ...item })),
    };
  }

  private obtenerProducto(productoId: number): Producto {
    const producto = this.productoService.obtenerProductoPorId(productoId);

    if (!producto) {
      throw new Error(`Producto con ID ${productoId} no encontrado`);
    }

    return producto;
  }
}
