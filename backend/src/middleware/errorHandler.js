const isProduction = process.env.NODE_ENV === "production";

const errorHandler = (err, req, res, next) => {
  if (!isProduction) {
    console.error("Unhandled Error:", err);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

module.exports = errorHandler;
