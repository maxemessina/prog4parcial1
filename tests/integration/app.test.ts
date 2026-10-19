
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { TomaProductosRouter } from '../../src/routes/productos.routes';
import { TomaPedidosRouter } from '../../src/routes/pedidos.routes';
import { TomaReportesRouter } from '../../src/routes/reportes.routes';
import { ProductoService } from '../../src/services/productoService';
import { PedidoService } from '../../src/services/pedidoService';

describe('Pruebas de Integración - API Cafetería Origen', () => {
  const prodService = new ProductoService();
  const pedService = new PedidoService(prodService);

  const app = createApp({
    productos: TomaProductosRouter(prodService),
    pedidos: TomaPedidosRouter(pedService, prodService),
    reportes: TomaReportesRouter(pedService), 
  });

  describe('GET /productos', () => {
    it('devuelve la lista completa de productos con status 200', async () => {
      const res = await request(app).get('/productos');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /productos/:id', () => {
    it('devuelve un producto específico cuando el ID existe', async () => {
      const res = await request(app).get('/productos/1');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('nombre');
    });

    it('devuelve 404 si el producto no existe en el catálogo', async () => {
      const res = await request(app).get('/productos/9999');
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('devuelve 400 si el ID enviado no es un número válido', async () => {
      const res = await request(app).get('/productos/abc');
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /pedidos', () => {
    it('crea un pedido exitosamente con status 201 si los productos existen', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send({
          items: [{ productoId: 1, cantidad: 2 }]
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.items).toHaveLength(1);
    });

    it('devuelve 400 si se intenta pedir un producto que no existe', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send({
          items: [{ productoId: 9999, cantidad: 1 }]
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /pedidos', () => {
    it('devuelve la lista de pedidos con status 200', async () => {
      const res = await request(app).get('/pedidos');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /pedidos/:id', () => {
    it('devuelve 404 si el pedido buscado no existe', async () => {
      const res = await request(app).get('/pedidos/9999');
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /reportes/facturacion', () => {
    it('devuelve la facturación total con status 200', async () => {
      const res = await request(app).get('/reportes/facturacion');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('facturacionTotal');
    });
  });

  describe('GET /reportes/mas-vendido', () => {
    it('devuelve el producto más vendido o el mensaje de que no hay ventas con status 200', async () => {
      const res = await request(app).get('/reportes/mas-vendido');
      
      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
    });
  });
});