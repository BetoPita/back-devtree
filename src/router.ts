// src/router.ts
import { Router } from 'express';
import { body } from 'express-validator'
// import { createAccount } from './handlers'; // <- correcta
import { createAccount } from './handlers/createAccount';
import { login } from './handlers/login';
import { handleInputError } from './middleware/validation';
import { getUser, updateProfile, uploadImage } from './handlers/users';
import { authenticate } from './middleware/auth';
const router = Router();

// console.log(typeof createAccount);

router.post("/auth/register",

  body('handle')
    .notEmpty()
    .withMessage('el handle no puede ir vacío'),
  body('name')
    .notEmpty()
    .withMessage('el nombre no puede ir vacío'),
  body('email')
    .isEmail()
    .withMessage('E-mail no válido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('El password debe tener mínimo 8 caracteres'),
  handleInputError,
  createAccount
); // aquí no debe dar error

router.post('/auth/login',
  body('email')
    .isEmail()
    .withMessage('E-mail no válido'),
  body('password')
    .notEmpty()
    .withMessage('El password es obligatorio'),
  handleInputError,
  login
)
router.get('/user', authenticate, getUser)
router.patch('/user',
  body('handle')
    .notEmpty()
    .withMessage('el handle no puede ir vacío'),
  handleInputError,
  body('description')
    .notEmpty()
    .withMessage('La descripción no puede ir vacía'),
  authenticate,
  updateProfile)


router.post('/user/image', authenticate, uploadImage)
export default router;
