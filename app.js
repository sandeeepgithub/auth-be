const express = require("express");

const userRoutes = require("./routes/userRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const cors = require("cors");

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1", apiRouter);

apiRouter.get("/test", (req, res) => {
  res.send("Working...");
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/user", userRoutes);

// if no routes found
app.all("/{*any}", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `No route found for ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    const errorDetails = err.error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message,
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors: errorDetails,
    });
  }

  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong.";

  res.status(status).json({
    status: "error",
    message,
  });
});

module.exports = app;
