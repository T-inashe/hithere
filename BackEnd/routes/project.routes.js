const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/auth.middleware");
const {
  createProject,
  getUserProjects,
  getProjectById,
  getAllProjects,
} = require("../controllers/project.controller");

router.post("/projects/create", checkAuth, createProject);
router.get("/projects/user", checkAuth, getUserProjects);
router.get("/projects/:id", checkAuth, getProjectById);
router.get("/projects", checkAuth, getAllProjects);

module.exports = router;