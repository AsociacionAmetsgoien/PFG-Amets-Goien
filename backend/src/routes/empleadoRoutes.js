import express from 'express';
import { getEmpleados, getEmpleadoById, createEmpleado, updateEmpleado, deleteEmpleado } from '../controllers/empleadoController.js';
import { validate } from '../middleware/validate.js';
import { empleadoSchema } from '../validations/empleadoValidation.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Empleado routes - todas requieren autenticación, solo admin puede modificar
router.get('/', auth, getEmpleados);
router.get('/:id', auth, getEmpleadoById);
router.post('/', auth, checkRole('admin'), validate(empleadoSchema), createEmpleado);
router.put('/:id', auth, checkRole('admin'), validate(empleadoSchema), updateEmpleado);
router.delete('/:id', auth, checkRole('admin'), deleteEmpleado);

export default router;