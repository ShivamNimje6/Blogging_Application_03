// backend/verifyToken.js

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json("You are not authenticated!");
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    req.userId = decoded._id; // Assuming your JWT payload has _id field for user ID
    next();
  });
};

module.exports = verifyToken;
