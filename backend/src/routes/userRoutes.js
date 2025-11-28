import express from 'express';
import { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, updateUserSchema } from '../validations/userValidation.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// User registration and login routes (for all roles)
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

// Protected routes - admin only
router.get('/', auth, checkRole('admin'), getUsers);
router.get('/:id', auth, checkRole('admin'), getUserById);
router.put('/:id', auth, checkRole('admin'), validate(updateUserSchema), updateUser);
router.delete('/:id', auth, checkRole('admin'), deleteUser);

export default router;