require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const clientRoutes = require("./routes/clientRoutes");
const taskRoutes = require("./routes/tasksRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Dev logger
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Compliance Tracker API running",
    timestamp: new Date(),
  });
});

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/tasks", taskRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});

module.exports = app;