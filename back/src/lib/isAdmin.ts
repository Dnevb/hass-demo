import { Request, NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    if (!token)
      return res.status(300).json({
        errors: [
          {
            msg: "Ingrese sesion para continuar",
          },
        ],
      });

    const payload = verify(token, process.env.SECRET!) as any;
    if (payload.admin) return next();
    else
      return res.json({
        errors: [
          {
            msg: "No esta autorizado para realizar esta accion",
          },
        ],
      });
  };
};
