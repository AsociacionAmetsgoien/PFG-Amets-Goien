import express from 'express';
import { getAllDonaciones, getDonacionById, getDonacionesByColaborador } from '../controllers/donacionController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Todas las rutas requieren autenticación
// Solo administradores pueden ver donaciones
router.get('/', auth, checkRole('admin'), getAllDonaciones);
router.get('/:id', auth, checkRole('admin'), getDonacionById);
router.get('/colaborador/:colaborador_id', auth, checkRole('admin'), getDonacionesByColaborador);

export default router;
