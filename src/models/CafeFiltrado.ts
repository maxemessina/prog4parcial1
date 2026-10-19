import {
  gramosPorTamanoFiltrado,
  precioPorGramo,
  type TamanoCafe,
  type VariedadCafe,
} from "./Cafe";
import { Producto } from "./Producto";

export class CafeFiltrado extends Producto {
  constructor(
    id: number,
    public readonly tamano: TamanoCafe,
    public readonly variedad: VariedadCafe
  ) {
    super(id, `Café filtrado ${tamano} ${variedad}`, 3200);
  }

  override calcularPrecio(): number {
    return this.precioBase + gramosPorTamanoFiltrado[this.tamano] * precioPorGramo[this.variedad];
  }
}
