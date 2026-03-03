/**
 * @file redsysRoutes.js
 * @description Rutas para integración con Redsys (TPV Virtual de La Caixa)
 */

import express from 'express';
import {
  createRedsysTransaction,
  handleRedsysNotification,
  handleRedsysReturn,
  checkPaymentStatus
} from '../controllers/redsysController.js';

const router = express.Router();

/**
 * POST /api/payment/redsys/create
 * Crea una nueva transacción de pago con Redsys
 * Body: { amount, colaboradorData }
 */
router.post('/create', createRedsysTransaction);

/**
 * POST /api/payment/redsys/notification
 * Webhook para recibir notificaciones automáticas de Redsys
 * No requiere autenticación (viene de Redsys)
 */
router.post('/notification', handleRedsysNotification);

/**
 * GET /api/payment/redsys/return
 * Maneja el retorno del usuario desde la pasarela de Redsys
 * Query params: Ds_MerchantParameters, Ds_Signature
 */
router.get('/return', handleRedsysReturn);

/**
 * GET /api/payment/redsys/status/:orderId
 * Consulta el estado de un pago por su orderId
 */
router.get('/status/:orderId', checkPaymentStatus);

export default router;
