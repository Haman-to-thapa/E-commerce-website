



import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Not authorized, token is empty" });
      }

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing in environment variables.");
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const secretKey = process.env.JWT_SECRET.trim();

      try {
        const decoded = jwt.verify(token, secretKey);

        if (!decoded.user || !decoded.user._id) {
          return res.status(401).json({ message: "Invalid token payload" });
        }

        const user = await User.findById(decoded.user._id).select("-password");

        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

      } catch (jwtError) {
        console.error("JWT verification error:", jwtError);
        return res.status(401).json({ message: "Not authorized, token invalid" });
      }

    } catch (error) {
      console.error("Token processing failed", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

export default protect;


