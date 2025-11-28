import express from 'express';
import { getNoticias, getNoticiaById, updateNoticia, deleteNoticia, createNoticia } from '../controllers/noticiaController.js';
import { validate } from '../middleware/validate.js';
import { noticiaSchema } from '../validations/noticiaValidation.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Noticia routes - todas requieren autenticación
router.get('/', auth, getNoticias);
router.get('/:id', auth, getNoticiaById);
router.post('/', auth, checkRole('admin', 'empleado'), validate(noticiaSchema), createNoticia);
router.put('/:id', auth, checkRole('admin', 'empleado'), validate(noticiaSchema), updateNoticia);
router.delete('/:id', auth, checkRole('admin'), deleteNoticia);

export default router;