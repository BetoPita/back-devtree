import { Request, Response } from 'express';

export const getUser = async (req: Request, res) => {
  res.json(req.user);
}

