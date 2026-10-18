
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { TomaProductosRouter } from '../../src/routes/productos.routes';
import { ProductoService } from '../../src/services/productoService';
import { Router } from 'express';

describe('Pruebas de Integración - API Cafetería Origen', () => {

  const productoService = new ProductoService();

  const emptyRouter = Router();

  const app = createApp({
    productos: TomaProductosRouter(productoService),
    pedidos: emptyRouter,
    reportes: emptyRouter,
  });

  describe('GET /productos', () => {
    it('devuelve la lista completa de productos con status 200', async () => {
      const response = await request(app).get('/productos');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0); // Verifica que la colección no esté vacía
    });
  });

  describe('GET /productos/:id', () => {
    it('devuelve un producto específico cuando el ID existe', async () => {
      const response = await request(app).get('/productos/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('nombre');
      expect(response.body).toHaveProperty('precioBase');
    });

    it('devuelve 404 si el producto no existe en el catálogo', async () => {
      const response = await request(app).get('/productos/9999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('devuelve 400 si el ID enviado no es un número válido', async () => {
      const response = await request(app).get('/productos/abc');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});