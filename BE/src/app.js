require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/job.routes");
const saveJobRoutes = require("./routes/saveJob.routes");
const applicationRoutes = require("./routes/application.routes");
const employerRoutes = require("./routes/employer.routes");
const skillRoutes = require("./routes/skill.routes");
const candidateRoutes = require("./routes/candidate.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const categoryRoutes = require("./routes/category.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

/* =====================
   GLOBAL MIDDLEWARE
===================== */
app.use(cors());

// 🔥 QUAN TRỌNG: PARSE TẤT CẢ BODY
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: true })); // form-data / x-www-form-urlencoded

/* =====================
   ROUTES
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/saved-jobs", saveJobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/uploads", express.static("public/uploads"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);

/* =====================
   HEALTH CHECK
===================== */
app.get("/health", (req, res) => {
  console.log("HIT /health");
  res.json({ status: "Backend is running" });
});

/* =====================
   GLOBAL ERROR HANDLER
===================== */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
