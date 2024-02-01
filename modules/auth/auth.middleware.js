const passport = require("passport");
const { strategy } = require("./auth.strategy");

const auth = (req, res, next) => {
  passport.authenticate(strategy, (error, user) => {
    if (error || !user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = req.header("authorization").split(" ")[1];

    if (user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = {
  auth,
};
