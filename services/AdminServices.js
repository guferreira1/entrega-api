import jwt from "jsonwebtoken";
import users from "../src/database";

export const deleteUserAdmin = (id, authorization) => {
  const token = authorization.split(" ")[1];

  return jwt.verify(token, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.send(error.message);
    }

    if (req.params.uuid === decoded.sub) {
      const findUserDelete = users.findIndex((user) => user.uuid === id);

      users.splice(findUserDelete, 1);

      return res.status(204).json({});
    } else {
      return res.status(403).json({ message: "missing admin permissions" });
    }
  });
};
