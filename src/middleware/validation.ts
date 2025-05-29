import { NextFunction, Request } from 'express';
import { validationResult } from 'express-validator';
export const handleInputError = (req : Request, res, next: NextFunction) => {

  //manejo de errores
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() })
  }
  next()
}
