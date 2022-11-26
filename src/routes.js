import { Router } from "express";
import { listUsersAdmin } from "./Controllers/UserAdminController";
import {
  adminDelete,
  createUser,
  deleteUser,
  loggedUser,
  loginUser,
  pathUser,
} from "./Controllers/UserController";
import {
  authMiddlewareAdmin,
  authMiddlewareToken,
} from "./middleware/authMiddleware";

const routes = Router();

routes.post("/users", createUser);
routes.post("/login", loginUser);

routes.use(authMiddlewareToken);
routes.get("/users/profile", loggedUser);
routes.delete("/users/:uuid", deleteUser);
routes.patch("/users/:uuid", pathUser);

routes.use(authMiddlewareAdmin);
routes.get("/users", listUsersAdmin);

export default routes;
