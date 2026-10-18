
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
import { Producto } from "../models/Producto";
import { CafeExpreso } from "../models/CafeExpreso";
import { CafeFiltrado } from "../models/CafeFiltrado";
import { Muffin } from "../models/Muffin";
import { TortaSelvaNegra } from "../models/Torta";
import type { TamanoCafe, VariedadCafe } from "../models/Cafe";

export class ProductoService {
  private productos: Producto[] = [];

  constructor() {
    this.inicializarCatalogo();
  }

  private inicializarCatalogo() {
    let idCounter = 1;

    const tamanos: TamanoCafe[] = ["Pocillo", "Mediano", "Taza grande"];
    const variedades: VariedadCafe[] = ["Brasil", "Colombia", "Etiopía"];

    for (const tamano of tamanos) {
      for (const variedad of variedades) {
        this.productos.push(new CafeExpreso(idCounter++, tamano, variedad));
      }
    }

    for (const tamano of tamanos) {
      for (const variedad of variedades) {
        this.productos.push(new CafeFiltrado(idCounter++, tamano, variedad));
      }
    }

    this.productos.push(new Muffin(idCounter++));
    this.productos.push(new TortaSelvaNegra(idCounter++));
  }

  listarProductos(): Producto[] {
    return this.productos;
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find((p) => p.id === id);
  }
}
