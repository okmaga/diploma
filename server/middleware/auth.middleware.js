const tokenService = require("../services/token.service");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unathorized"});
    };

    const data = tokenService.validateAccess(token);

    if (!data) {
      return res.status(401).json({message: "Unauthorized"});
    }

    const user = await User.findById(data._id);
    const isAdmin = user.role === "admin";

    if (isAdmin) {
      req.isAdmin = true;
    }

    if (req.method === "DELETE" && !isAdmin) {
      return res.status(403).json({message: "Forbidden"});
    };

    req.user = data;

    next();

  } catch (e) {
    res.status(401).json({ message: "Unathorized"});
  };
};