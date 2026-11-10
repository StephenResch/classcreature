import { Router } from 'express';
import { createWebController } from '#controllers/web-controller.js';
import { createPetController } from '#controllers/pet-controller.js';
import { requireAuthentication } from '#middleware/auth.js';

export function createWebRouter(container) {
  const router = Router();
  const controller = createWebController(container);
  const petController = createPetController(container);
  router.get('/', controller.home);
  router.get('/example', requireAuthentication(), controller.example);
  router.get('/inventory', requireAuthentication(), petController.inventory)
  router.get('/creature', requireAuthentication(), petController.creature)
  router.get('/egg', requireAuthentication(), petController.egg)
  router.get('/shop', petController.shop)
  return router;
}