import express from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { isLogin, isLogout } from "../middlewares/auth.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// logger.info("__filename===>", __filename);
// logger.info("__dirname===>", __dirname);

import {
  userDashboard,
  userLogin,
  userLoginLoad,
  userLogout,
  userRegister,
  userRegisterLoad,
} from "../controllers/userController.js";

const route = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

route.get("/register", isLogout, userRegisterLoad);
route.post("/register", upload.single("image"), userRegister);

route.get("/", isLogout, userLoginLoad);
route.post("/login", userLogin);

route.get("/logout", isLogin, userLogout);
route.get("/dashboard", isLogin, userDashboard);

route.get("*", function (req, res) {
  res.redirect("/");
});

export default route;
