import express from "express";
import {
  save_user,
  listUsers,
  save_role,
  getRole,
  delete_role,
  update_role,
  delete_user,
  update_user,
  loginUser
} from "../controllers/UserController.js";

const addUserRouter = express.Router();

addUserRouter.post("/add", save_user);
addUserRouter.get("/listuser", listUsers);
addUserRouter.put("/updateuser", update_user);
addUserRouter.post("/deleteuser", delete_user);

addUserRouter.post("/role", save_role);
addUserRouter.get("/getrole", getRole);
addUserRouter.put("/updaterole", update_role);
addUserRouter.post("/deleterole", delete_role);

//login 
addUserRouter.post("/login", loginUser);

export default addUserRouter;
