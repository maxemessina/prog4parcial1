export interface PedidoItem {
  productoId: number;
  cantidad: number;
}

export interface Pedido {
  readonly id: number;
  items: PedidoItem[];
  estado: string;
}

export interface PedidoConTotal extends Pedido {
  readonly total: number;
}