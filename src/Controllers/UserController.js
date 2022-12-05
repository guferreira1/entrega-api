import {
  createUserService,
  deleteUserService,
  loggedUserService,
  loginUserService,
  pathUserService,
} from "../../services/UserServices";

export const createUser = async (req, res) => {
  const [status, user] = await createUserService(req.body);

  return res.status(status).json(user);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const [status, token] = await loginUserService(email, password);

  return res.status(status).json(token);
};

export const loggedUser = (req, res) => {
  const { authorization } = req.headers;

  const [status, user] = loggedUserService(authorization);

  return res.status(status).json(user);
};

export const deleteUser = (req, res) => {
  const { authorization } = req.headers;

  const [status, data] = deleteUserService(req.params.id, authorization);

  return res.status(status).json(data);
};

export const pathUser = (req, res) => {
  const { authorization } = req.headers;

  const id = req.params.uuid;

  const data = req.body;

  const [status, user] = pathUserService(data, id, authorization);

  return res.status(status).json(user);
};
