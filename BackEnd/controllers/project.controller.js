const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : req.session.user[0].email;
    const newProject = await Project.create({ ...req.body, creator_email: userEmail });
    res.json({ success: true, projectId: newProject._id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating project" });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : req.session.user[0].email;
    const projects = await Project.find({ creator_email: userEmail }).sort({ created_at: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching projects" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.json({ success: false, message: "Project not found" });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching project details" });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const filter = req.query.area ? { research_area: req.query.area } : {};
    const projects = await Project.find(filter).sort({ created_at: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching projects" });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  getAllProjects,
};