// src/handlers/createAccount.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import slug from 'slug';
import User from '../models/User';
import { hashPassword } from '../utils/auth';

export const createAccount = async (
  req: Request,
  res,
  next: NextFunction
) => {
  try {
    //manejo de errores
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({errors: errors.array()})
    }

    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ error: 'El usuario ya está registrado' });
    }

    const handle = slug(req.body.handle, '');

    const handleExist = await User.findOne({ handle });
    if (handleExist) {
      return res.status(409).json({ error: 'Nombre de usuario no disponible' });
    }

    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = handle

    await user.save();

    return res.status(201).send('registro creado correctamente')
  } catch (error) {
    next(error);
  }
};
