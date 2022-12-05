import { v4 as uuid } from "uuid";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import users from "../src/database";

export const createUserService = async ({ name, email, password, isAdm }) => {
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

  return [201, newUser];
};

export const loginUserService = async (email, password) => {
  const userExists = users.find((user) => user.email === email);

  if (!userExists) {
    return [401, { message: "E-mail ou senha inválidos" }];
  }

  const comparePass = await compare(password, userExists.password);

  if (!comparePass) {
    return [401, { message: "E-mail ou senha inválidos" }];
  }

  const token = jwt.sign({ email }, "SECRET_KEY", {
    expiresIn: "1d",
    subject: userExists.uuid,
  });

  return [200, { token }];
};

export const loggedUserService = (authorization, res) => {
  const token = authorization.split(" ")[1];

  console.log(token);

  return jwt.verify(token, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.send(error.message);
    }

    const user = users.find((user) => user.email === decoded.email);

    const { password: removePass, ...getUser } = user;

    return [200, getUser];
  });
};

export const deleteUserService = (id, authorization) => {
  const token = authorization.split(" ")[1];

  return jwt.verify(token, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.send(error.message);
    }

    const verifyAdmin = users.find((admin) => admin.email === decoded.email);

    if (verifyAdmin.isAdm) {
      const findAdminDelete = users.findIndex((user) => user.uuid === id);

      users.splice(findAdminDelete, 1);

      return [204, {}];
    } else {
      return [403, { message: "missing admin permissions" }];
    }
  });
};

export const pathUserService = (data, id, authorization) => {
  const foundUser = users.find((user) => user.uuid === id);

  foundUser.updatedOn = new Date();

  const token = authorization.split(" ")[1];

  return jwt.verify(token, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.send(error.message);
    }

    const user = users.find((user) => user.uuid === decoded.sub);
    console.log(user);

    if (id === decoded.sub) {
      const editedUser = { ...foundUser, ...data };

      const index = users.findIndex((user) => user.uuid === id);

      users.splice(index, 1);

      users.push(editedUser);
      const { password: removePass, ...newUser } = editedUser;

      return [200, newUser];
    }

    if (user.isAdm) {
      const editedUser = { ...foundUser, ...data };

      const index = users.findIndex((user) => user.uuid === id);

      users.splice(index, 1);

      users.push(editedUser);

      return [200, editedUser];
    }

    return [403, { message: "missing admin permissions" }];
  });
};
