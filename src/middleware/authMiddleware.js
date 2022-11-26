import jwt from "jsonwebtoken";
import users from "../database";

export const authMiddlewareToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ message: "Missing authorization headers" });
  }

  next();
};

export const authMiddlewareAdmin = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  return jwt.verify(token, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.send(error.message);
    }

    const user = users.find((user) => user.email === decoded.email);

    if (!user.isAdm) {
      return res.status(403).json({ message: "missing admin permissions" });
    }

    next();
  });
};
