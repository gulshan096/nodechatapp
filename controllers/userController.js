import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import logger from "../logger.js";

export const userRegister = async (req, res) => {
  try {
    console.log("loginRequset===>", req.body);
    logger.info("requestBody", JSON.stringify(req.body));
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      image: "images/" + req.file.filename,
    });

    const result = await user.save();

    res.render("register", { message: "user has been register successfully." });
  } catch (error) {
    logger.info("error", error);
  }
};

export const userRegisterLoad = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {}
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log("loginRequset===>", req.body);
    const userExist = await User.findOne({ email: email });
    logger.info("userInfo===>", userExist);

    if (userExist) {
      const passMatch = await bcrypt.compare(password, userExist.password);
      if (passMatch) {
        req.session.user = userExist;
        res.redirect("/dashboard");
      } else {
        res.render("login", { message: "Email and password is incorrect." });
      }
    } else {
      res.render("login", { message: "Email and password is incorrect." });
    }
  } catch (error) {
    logger.info("error", error);
  }
};

export const userLoginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    logger.info("error", error);
  }
};

export const userDashboard = async (req, res) => {
  try {
    const users = await User.find({ _id: { $nin: req.session.user._id } });
    // console.log(users);
    res.render("dashboard", { user: req.session.user, users: users });
  } catch (error) {
    logger.info("error", error);
  }
};

export const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    logger.info("error", error);
  }
};
