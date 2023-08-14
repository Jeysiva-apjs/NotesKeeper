import jwt from "jsonwebtoken";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";

const SECRET = process.env.SECRET || "";

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "Unothorised" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, payload) => {
    if (err) {
      return res.send(403).json({ message: err.message });
    }
    if (!payload || typeof payload == "string") {
      return res.sendStatus(403);
    }

    req.headers["userId"] = payload.id;
    next();
  });
};

export default authenticateJwt;
