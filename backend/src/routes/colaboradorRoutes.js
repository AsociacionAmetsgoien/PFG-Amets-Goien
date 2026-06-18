import express from 'express';
import { getColaboradores, getColaboradorById, createColaborador, updateColaborador, deleteColaborador, registerVoluntarioPublico } from '../controllers/colaboradorController.js';
import { registerRecurrentePublico } from '../controllers/recurrenteController.js';
import { validate } from '../middleware/validate.js';
import { colaboradorSchema, voluntarioPublicoSchema } from '../validations/colaboradorValidation.js';
import { recurrentePublicoSchema } from '../validations/recurrenteValidation.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// ===== RUTA PÚBLICA (sin autenticación) =====
// IMPORTANTE: Esta ruta DEBE ir ANTES de las rutas con auth
router.post('/registro-voluntario', validate(voluntarioPublicoSchema), registerVoluntarioPublico);
router.post('/registro-recurrente', validate(recurrentePublicoSchema), registerRecurrentePublico);

// ===== RUTAS PROTEGIDAS (requieren autenticación) =====
router.get('/', auth, getColaboradores);
router.get('/:id', auth, getColaboradorById);
router.post('/', auth, checkRole('admin', 'empleado'), validate(colaboradorSchema), createColaborador);
router.put('/:id', auth, checkRole('admin', 'empleado'), validate(colaboradorSchema), updateColaborador);
router.delete('/:id', auth, checkRole('admin'), deleteColaborador);

export default router;