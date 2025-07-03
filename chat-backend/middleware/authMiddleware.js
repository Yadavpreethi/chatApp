const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
        console.log("✅ Token verified. User ID:", req.user);

    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = verifyToken;
