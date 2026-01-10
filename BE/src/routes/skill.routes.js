const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skill.controller");

// skills theo category (cho job)
router.get("/by-category/:categoryId", skillController.getSkillsByCategory);

// ALL skills (cho candidate)
router.get("/", skillController.getAllSkills);

module.exports = router;
