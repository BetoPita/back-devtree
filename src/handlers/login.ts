import { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword } from '../utils/auth';


export const login = async (req: Request, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'El usuario no existe' });
  }
  const isPassCorrect = await checkPassword(password, user.password);

  if (!isPassCorrect) {
    const error = new Error('Password incorrecto');
    return res.status(404).json({ error: error.message });
  }
  return res.status(200).json({ msg: "autentificado" });
  // comprobar pass
}
