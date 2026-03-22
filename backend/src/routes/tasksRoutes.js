const express = require("express");
const router = express.Router();

const {
  getTasksByClient,
  createTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/tasks");


router.get("/:clientId", getTasksByClient);
router.post("/", createTask);
router.patch("/:id/status", updateTaskStatus);
router.delete("/:id", deleteTask);

module.exports = router;