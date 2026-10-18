
import { describe, expect, it } from "vitest";
import { Muffin } from "../../src/models/Muffin";
import { TortaSelvaNegra } from "../../src/models/Torta";
import { CafeExpreso } from "../../src/models/CafeExpreso";
import { CafeFiltrado } from "../../src/models/CafeFiltrado";

describe("Cálculo de precios de productos", () => {  //agrupamos pruebas relacionadas condescribe
  it("calcula el precio de un muffin", () => { //con cada it definimos los casos
    const muffin = new Muffin(1);

    expect(muffin.calcularPrecio()).toBe(2500); //los expect de que esperamos como resultado
  });

  it("calcula el precio de una porción de torta", () => {
    const torta = new TortaSelvaNegra(2);

    expect(torta.calcularPrecio()).toBe(4200); //.toBe(...): compara el resultado obtenido con el valor esperado.
  });

  it("calcula el precio de un café expreso mediano de Colombia", () => {
    const cafe = new CafeExpreso(3, "Mediano", "Colombia");

    expect(cafe.calcularPrecio()).toBe(7360);
  });

  it("calcula el precio de un café filtrado pequeño de Brasil", () => {
    const cafe = new CafeFiltrado(4, "Pocillo", "Brasil");

    expect(cafe.calcularPrecio()).toBe(4040);
  });
});
