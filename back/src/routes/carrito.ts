import { json, Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import db from "../db";
import getUser from "../lib/getUser";

const router = Router();

const orden_query = db("orden")
  .select("orden.*")
  .orderBy("orden.created_at", "desc")
  .limit(1)
  .where({
    completada: false,
  });

router.get("/historial", (req, res) => {
  const user = getUser(req);
  if (!user)
    return res.json({
      data: null,
      errors: [
        {
          msg: "Ingrese sesion para continuar",
        },
      ],
    });

  db("orden")
    .select(
      "*",
      db.raw(
        "(select count(uid) from orden_producto where orden_producto.orden_id= orden.uid)"
      )
    )
    .where({
      completada: true,
      usuario_id: user.uid,
    })
    .then((rs) =>
      res.json({
        data: rs,
      })
    );
});

router.post("/completar", async (req, res) => {
  const user = getUser(req);
  if (!user)
    return res.json({
      data: null,
      errors: [
        {
          msg: "Ingrese sesion para continuar",
        },
      ],
    });
  const carrito = await orden_query.clone().andWhere({
    usuario_id: user.uid,
  });
  if (carrito.length === 0)
    return res.json({
      errors: [
        {
          msg: "No posee ningun carrito activo",
        },
      ],
    });

  const trx = await db.transaction();
  const productos = await trx("orden_producto")
    .select(
      "producto.uid as producto_id",
      "orden_producto.cantidad",
      "producto.nombre",
      "producto.precio",
      "orden_producto.uid"
    )
    .leftJoin("producto", "producto.uid", "orden_producto.producto_id")
    .where({
      orden_id: carrito[0].uid,
    });
  productos.forEach(
    async ({ uid, cantidad }) =>
      await trx("producto")
        .update(
          {
            cantidad: trx.raw(`cantidad - ${cantidad}`),
          },
          "*"
        )
        .where({ uid })
  );
  await trx("orden")
    .update(
      {
        completada: true,
        updated_at: trx.raw("default"),
      },
      "*"
    )
    .then((rs) =>
      res.json({
        data: {
          productos,
          fecha: rs[0].updated_at,
          total: productos
            .map((p) => p.precio)
            .reduce((a, b) => a + b, 0)
            .toFixed(2),
        },
      })
    );

  trx.commit();
});

router.delete("/producto", (req, res) => {
  const { id } = req.body;

  const user = getUser(req);
  if (!user)
    return res.json({
      data: null,
      errors: [
        {
          msg: "Ingrese sesion para continuar",
        },
      ],
    });

  db("orden_producto")
    .delete()
    .where({
      uid: id,
    })
    .then((rs) =>
      res.json({
        data: rs,
      })
    );
});

router.patch(
  "/producto",
  checkSchema({
    id: {
      isString: true,
    },
    cantidad: {
      isInt: true,
      optional: {
        options: { nullable: true },
      },
    },
  }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty)
      return res.json({
        errors: errors.array(),
      });

    const { id, cantidad } = req.body;
    db("orden_producto")
      .update(
        {
          cantidad,
          updated_at: db.raw("default"),
        },
        "*"
      )
      .where({
        uid: id,
      })
      .then((rs) =>
        res.json({
          data: rs,
        })
      );
  }
);

router.post(
  "/producto",
  checkSchema({
    id: {
      isString: true,
    },
    cantidad: {
      isInt: true,
    },
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty)
      return res.json({
        errors: errors.array(),
      });
    const user = getUser(req);
    if (!user)
      return res.json({
        data: null,
        errors: [
          {
            msg: "Ingrese sesion para continuar",
          },
        ],
      });

    const { id, cantidad } = req.body;
    var carrito = await orden_query.clone().andWhere({
      usuario_id: user.uid,
    });

    db.transaction(async (trx) => {
      if (carrito.length === 0) {
        carrito = await trx("orden").insert(
          {
            usuario_id: user.uid,
          },
          "*"
        );
      }

      trx("orden_producto")
        .insert(
          {
            producto_id: id,
            cantidad,
            orden_id: carrito[0].uid,
          },
          "*"
        )
        .then((rs) =>
          res.json({
            data: rs,
          })
        );
    });
  }
);

router.get("/", async (req, res) => {
  const user = getUser(req);
  if (!user)
    return res.json({
      data: null,
      errors: [
        {
          msg: "Ingrese sesion para continuar",
        },
      ],
    });

  const q = orden_query.clone();
  const carrito = await q.andWhere({
    usuario_id: user.uid,
  });

  if (carrito.length === 0)
    return res.json({
      data: null,
    });

  db("orden_producto")
    .select(
      "producto.nombre",
      "producto.precio",
      "producto.url_img",
      "producto.uid as producto_id",
      "orden_producto.uid as uid",
      "orden_producto.cantidad"
    )
    .leftJoin("producto", "producto.uid", "orden_producto.producto_id")
    .where({
      orden_id: carrito[0].uid,
    })
    .then((rs) => {
      return res.json({
        data: rs.map((producto) => ({
          ...producto,
          precio: producto.cantidad * producto.precio,
        })),
      });
    });
});

export default router;
