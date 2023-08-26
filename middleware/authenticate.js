const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === "null") {
    res.status(401).json({ message: "No token provided!", status: 401 });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong with the server!",
      status: 500,
    });
  }
};

module.exports = authenticate;
