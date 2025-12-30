import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Admin only",
    });
  }
  next();
};

const globalErrorMiddleware = (err, req, res, next) => {
  let error = err;

  // MongoDB errors
  if (error.name === "CastError") {
    error = new CustomError("Invalid ID format", 400);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    error = new CustomError(`${field} already exists`, 409);
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    error = new CustomError(messages.join(", "), 400);
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    error = new CustomError("Invalid token", 401);
  }

  if (error.name === "TokenExpiredError") {
    error = new CustomError("Token expired, please login again", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.isOperational ? error.message : "Something went wrong",
  });
};

export { authMiddleware, isAdmin, globalErrorMiddleware };
