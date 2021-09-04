import { Router } from "express";
import auth from "./auth";
import producto from "./producto";
import carrito from "./carrito";

const router = Router();

router.use(auth);
router.use("/productos", producto);
router.use("/carrito", carrito);

export default router;
