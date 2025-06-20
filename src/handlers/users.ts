import { Request, Response } from 'express';
import slug from 'slug';
import User from '../models/User';
import formidable from 'formidable';
import cloudinary from '../config/cloudinary';
import { v4 as uuid } from 'uuid';
export const getUser = async (req: Request, res) => {
  res.json(req.user);
}

export const updateProfile = async (req: Request, res) => {
  try {
    const { description } = req.body
    const handle = slug(req.body.handle, '');
    const handleExist = await User.findOne({ handle });
    if (handleExist && handleExist.email !== req.user.email) {
      return res.status(409).json({ error: 'Nombre de usuario no disponible' });
    }
    //actualizar user
    req.user.description = description
    req.user.handle = handle
    // en la interface se necesita extends Document para acceder a los métodos de mongoose
    await req.user.save();
    res.send('Perfil actualizado correctamente');
  } catch (e) {
    const error = new Error('Hubo un error')
    return res.status(500).json({ error: error.message })
  }
}

export const uploadImage = async (req: Request, res) => {
  const form = formidable({ multiples: false })
  try {
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
        if (error) {
          const error = new Error('Hubo un error')
          return res.status(500).json({ error: error.message })
        }
        if (result) {
          req.user.image = result.secure_url
          await req.user.save();
          res.json({ image: result.secure_url })
        }
      })
    })
  } catch (e) {
    const error = new Error('Hubo un error')
    return res.status(500).json({ error: error.message })
  }
}
