const express = require("express");
const router = express.Router();

const {
  getAllClientsWithStats,
  getClientById,
  createClient,
  deleteClientAndTasks,
} = require("../controllers/client");


// routes
router.get("/", getAllClientsWithStats);
router.get("/:id", getClientById);
router.post("/", createClient);
router.delete("/:id", deleteClientAndTasks);

module.exports = router;