const multer = require("multer");
const path = require("path");
const fs = require("fs");

// đường dẫn tuyệt đối
const uploadDir = path.join(__dirname, "../../public/uploads/employers");

// tạo folder nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    // ❗ dùng req.user (authMiddleware)
    const userId = req.user?.id || "unknown";

    cb(null, `employer_${userId}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Chỉ cho phép upload ảnh"), false);
  }
  cb(null, true);
};

const uploadEmployerLogo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("logo"); // 👈 BẮT BUỘC

module.exports = uploadEmployerLogo;
