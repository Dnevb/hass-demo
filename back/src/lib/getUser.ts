import { Request } from "express";
import { verify } from "jsonwebtoken";

export default (req: Request) => {
  const token = req.headers["authorization"];
  if (!token) return null;

  return verify(token, process.env.SECRET!) as any;
};
