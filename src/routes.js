import { Router } from "express";
import { deleteAdmin, listUsersAdmin } from "./Controllers/UserAdminController";
import {
  createUser,
  deleteUser,
  loggedUser,
  loginUser,
  pathUser,
} from "./Controllers/UserController";
import {
  authMiddlewareAdmin,
  authMiddlewareToken,
  verifyUserExists,
} from "./middleware/authMiddleware";

const routes = Router();

routes.post("/login", loginUser);

routes.post("/users", verifyUserExists, createUser);

routes.use(authMiddlewareToken);
routes.get("/users/profile", loggedUser);
routes.patch("/users/:uuid", pathUser);
routes.delete("/users/:uuid", deleteUser);

routes.use(authMiddlewareAdmin);
routes.get("/users", listUsersAdmin);
routes.delete("/users/:uuid", deleteAdmin);

export default routes;
