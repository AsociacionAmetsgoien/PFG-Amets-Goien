import express from 'express';
import { getActividades, getActividadById, createActividad, updateActividad, deleteActividad } from '../controllers/actividadController.js';
import { validate } from '../middleware/validate.js';
import { actividadSchema } from '../validations/actividadValidation.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Actividad routes - todas requieren autenticación
router.get('/', auth, getActividades);
router.get('/:id', auth, getActividadById);
router.post('/', auth, checkRole('admin', 'empleado'), validate(actividadSchema), createActividad);
router.put('/:id', auth, checkRole('admin', 'empleado'), validate(actividadSchema), updateActividad);
router.delete('/:id', auth, checkRole('admin'), deleteActividad);

export default router;