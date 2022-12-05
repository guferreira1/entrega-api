import { deleteUserAdmin, pathUserAdmin } from "../../services/AdminServices";
import users from "../database";

export const listUsersAdmin = (req, res) => {
  return res.json(users);
};

export const deleteAdmin = (req, res) => {
  const { authorization } = req.headers;

  const [status, data] = deleteUserAdmin(req.params.id, authorization);

  return res.status(status).json(data);
};

// export const pathAdmin = (req, res) => {
//   const { authorization } = req.headers;

//   const id = req.params.uuid;

//   const data = req.body;

//   const [status, user] = pathUserAdmin(data, id, authorization);

//   return res.status(status).json(user);
// };
