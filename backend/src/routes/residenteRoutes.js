import express from 'express';
import { getResidentes, getResidenteById, deleteResidente, updateResidente, createResidente } from '../controllers/residenteController.js';
import { validate } from '../middleware/validate.js';
import { residenteSchema } from '../validations/residenteValidation.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Residente routes - todas requieren autenticación
router.get('/', auth, getResidentes);
router.get('/:id', auth, getResidenteById);
router.post('/', auth, checkRole('admin', 'empleado'), validate(residenteSchema), createResidente);
router.put('/:id', auth, checkRole('admin', 'empleado'), validate(residenteSchema), updateResidente);
router.delete('/:id', auth, checkRole('admin'), deleteResidente);

export default router;