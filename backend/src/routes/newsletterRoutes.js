import express from 'express';
import { 
  getColaboradoresNewsletter, 
  sendNewsletter, 
  sendTestEmail 
} from '../controllers/newsletterController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

/**
 * Newsletter routes - Solo admin puede enviar newsletters
 * Empleados pueden ver la lista de colaboradores
 */

// GET /api/newsletter/colaboradores - Ver lista de colaboradores
router.get('/colaboradores', auth, checkRole('admin', 'empleado'), getColaboradoresNewsletter);

// POST /api/newsletter/send - Enviar newsletter real
router.post('/send', auth, checkRole('admin'), sendNewsletter);

// POST /api/newsletter/test - Enviar email de prueba
router.post('/test', auth, checkRole('admin'), sendTestEmail);

export default router;
