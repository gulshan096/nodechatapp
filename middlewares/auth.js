export const isLogin = async (req, res, next) => {
  try {
    if (req.session.user) {
    } else {
      res.redirect("/login");
    }
    next();
  } catch (error) {
    logger.info("error", error.message);
  }
};

export const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/dashboard");
    }
    next();
  } catch (error) {
    logger.info("error", error.message);
  }
};
