import { Router } from "express";
import { body, validationResult } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db";
import getUser from "../lib/getUser";

const router = Router();

router.get("/me", (req, res) => {
  const user = getUser(req);
  if (!user)
    return res.status(400).json({
      errors: [
        {
          msg: "Inicie sesion para continuar",
        },
      ],
    });
  try {
    const payload = verify(
      req.headers["authorization"]!,
      process.env.SECRET!
    );
    res.json({
      data: payload,
    });
  } catch (e) {
    res.json({
      errors: [
        {
          msg: "Token invalido",
        },
      ],
    });
  }
});

router.post(
  "/login",
  body("email").isEmail(),
  body("pass").isString(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });

    const { email, pass } = req.body;

    db.select("*")
      .from("usuario")
      .where("email", email)
      .first()
      .then((usuario: any) => {
        if (usuario)
          bcrypt.compare(pass, usuario.pass).then((result) => {
            if (result)
              res.json({
                token: sign(
                  {
                    email: usuario.email,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    uid: usuario.uid,
                    admin: usuario.admin,
                  },
                  process.env.SECRET!,
                  {
                    expiresIn: "4h",
                  }
                ),
              });
            else
              res.status(400).json({
                errors: [
                  {
                    msg: "Contraseña incorrecta",
                  },
                ],
              });
          });
        else
          res.json({
            errors: [
              {
                msg: "Usuario no encontrado",
              },
            ],
          });
      });
  }
);

router.post(
  "/register",
  body("email").isEmail(),
  body("pass").isString().isLength({ min: 5 }),
  body("nombres").isString(),
  body("apellidos").isString(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });

    const { email, pass, nombres, apellidos } = req.body;

    bcrypt.hash(pass, 10).then((hash) => {
      db("usuario")
        .insert({ email, pass: hash, nombres, apellidos }, "*")
        .then((rs) =>
          res.json({
            data: rs,
          })
        )
        .catch(() =>
          res.status(500).json({
            errors: [
              {
                msg: "Hubo un problema, intentelo mas tarde",
              },
            ],
          })
        );
    });
  }
);

export default router;
