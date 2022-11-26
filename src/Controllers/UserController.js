import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import users from "../database";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";

export const createUser = async (req, res) => {
  const { name, email, password, isAdm } = req.body;

  const userExists = users.find((user) => user.email === req.body.email);

  if (userExists) {
    return res
      .status(409)
      .json({ message: "This email is already being used" });
  }

  const hashPass = await bcrypt.hash(password, 10);

  const user = {
    uuid: uuid(),
    createdOn: new Date(),
    updatedOn: new Date(),
    name,
    email,
    isAdm,
    password: hashPass,
  };

  users.push(user);

  const { password: removePass, ...newUser } = user;

  return res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const userExists = users.find((user) => user.email === req.body.email);

  if (!userExists) {
    return res.status(401).json({ message: "E-mail ou senha inválidos" });
  }

  const comparePass = await compare(password, userExists.password);

  if (!comparePass) {
    return res.status(401).json({ message: "E-mail ou senha inválidos" });
  }

  const token = jwt.sign({ email }, "SECRET_KEY", {
    expiresIn: "1d",
    subject: userExists.uuid,
  });

  return res.json({ token });
};

export const loggedUser = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  return jwt.verify(token, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.send(error.message);
    }

    const user = users.find((user) => user.email === decoded.email);

    const { password: removePass, ...getUser } = user;

    res.json(getUser);
  });
};

export const deleteUser = (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  return jwt.verify(token, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.send(error.message);
    }

    const verifyAdmin = users.find((admin) => admin.email === decoded.email);

    if (verifyAdmin.isAdm) {
      const findAdminDelete = users.findIndex(
        (user) => user.uuid === req.params.uuid
      );

      users.splice(findAdminDelete, 1);

      return res.status(204).json({});
    }

    if (req.params.uuid === decoded.sub) {
      const findUserDelete = users.findIndex(
        (user) => user.uuid === req.params.uuid
      );

      users.splice(findUserDelete, 1);

      return res.status(204).json({});
    } else {
      return res.status(403).json({ message: "missing admin permissions" });
    }
  });
};

export const pathUser = (req, res) => {
  const user = users.find((user) => user.uuid === req.params.uuid);

  user.updatedOn = new Date();

  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  return jwt.verify(token, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.send(error.message);
    }

    const verifyAdmin = users.find((admin) => admin.email === decoded.email);

    if (verifyAdmin.isAdm) {
      const editUser = { ...user, ...req.body };

      const getUser = users.findIndex((user) => user.uuid === req.params.uuid);

      users.splice(getUser, 1);

      users.push(editUser);

      return res.json(editUser);
    }

    if (req.params.uuid === decoded.sub) {
      const editUser = { ...user, ...req.body };

      const getUser = users.findIndex((user) => user.uuid === req.params.uuid);

      users.splice(getUser, 1);

      users.push(editUser);

      const { password: pass, ...newUser } = editUser;

      return res.json(newUser);
    } else {
      return res.status(403).json({ message: "missing admin permissions" });
    }
  });
};
