import users from "../database";

export const listUsersAdmin = (req, res) => {
  return res.json(users);
};
