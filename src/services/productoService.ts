
import type { Producto } from "../models/Producto";
import { Muffin } from "../models/Muffin";
import { TortaSelvaNegra } from "../models/Torta";
import { CafeExpreso } from "../models/CafeExpreso";
import { CafeFiltrado } from "../models/CafeFiltrado";
import type { TamanoCafe, VariedadCafe } from "../models/Cafe";

export interface ProductoService {
  listarProductos(): Producto[];
  obtenerProductoPorId(id: number): Producto | undefined;
}

export class ProductoServiceMemoria implements ProductoService {
  private readonly productos: Producto[];

  constructor(productos?: Producto[]) {
    this.productos = productos ?? this.crearCatalogo();
  }

  listarProductos(): Producto[] {
    return [...this.productos];
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find((producto) => producto.id === id);
  }

  private crearCatalogo(): Producto[] {
    const productos: Producto[] = [
      new Muffin(1),
      new TortaSelvaNegra(2),
    ];

    const tamanos: TamanoCafe[] = ["Pocillo", "Mediano", "Taza grande"];
    const variedades: VariedadCafe[] = ["Brasil", "Colombia", "Etiopía"];

    let id = 3;

    for (const tamano of tamanos) {
      for (const variedad of variedades) {
        productos.push(new CafeExpreso(id++, tamano, variedad));
        productos.push(new CafeFiltrado(id++, tamano, variedad));
      }
    }

    return productos;
  }
}
