const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");

// PUBLIC – EMPLOYER
router.get("/", categoryController.getActiveCategories);

module.exports = router;
