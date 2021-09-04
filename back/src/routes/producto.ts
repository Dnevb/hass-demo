import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import db from "../db";
import getUser from "../lib/getUser";
import isAdmin from "../lib/isAdmin";

const router = Router();

router.delete(
  "/",
  isAdmin(),
  checkSchema({
    id: {
      isString: true,
    },
  }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({
        errors: errors.array(),
      });

    const { id } = req.body;

    db("producto")
      .delete()
      .where({
        uid: id,
      })
      .then((rs) =>
        res.json({
          data: !!rs,
        })
      );
  }
);

router.post(
  "/",
  isAdmin(),
  checkSchema({
    nombre: {
      isString: true,
    },
    descripcion: {
      isString: true,
      optional: {
        options: { nullable: true },
      },
    },
    cantidad: {
      isInt: true,
      toInt: true,
    },
    precio: {
      isFloat: true,
      toFloat: true,
    },
    url_image: {
      isSlug: true,
      optional: {
        options: { nullable: true },
      },
    },
  }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({
        errors: errors.array(),
      });

    const producto = req.body;
    db("producto")
      .insert(producto, "*")
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
  }
);

router.get("/", (req, res) => {
  db("producto")
    .select("*")
    .whereRaw("cantidad > 1")
    .then((productos) => {
      if (productos.length === 0)
        return res.status(500).json({
          data: null,
          errors: [
            {
              msg: "No se encontraron productos",
            },
          ],
        });
      res.json({
        data: productos,
      });
    })
    .catch(() =>
      res.json({
        errors: [
          {
            msg: "Un error ha ocurrido, intentelo mas tarde",
          },
        ],
      })
    );
});

router.get("/:id", (req, res) => {
  db("producto")
    .select("*")
    .where({ uid: req.params.id })
    .first()
    .then((producto) => {
      if (!producto)
        return res.json({
          data: null,
          errors: [
            {
              msg: "Producto no encontrado",
            },
          ],
        });
      res.json({
        data: producto,
      });
    });
});

export default router;
