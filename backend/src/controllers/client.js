const Client = require("../models/Client");
const Task = require("../models/Task");

// ─────────────────────────────────────────
// GET ALL CLIENTS WITH STATS
// ─────────────────────────────────────────
const getAllClientsWithStats = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ company_name: 1 }).lean();

    const now = new Date();

    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const [total, completed, overdue] = await Promise.all([
          Task.countDocuments({ client_id: client._id }),
          Task.countDocuments({ client_id: client._id, status: "Completed" }),
          Task.countDocuments({
            client_id: client._id,
            status: { $in: ["Pending", "In Progress"] },
            due_date: { $lt: now },
          }),
        ]);

        return {
          ...client,
          stats: {
            total,
            completed,
            overdue,
            pending: total - completed,
          },
        };
      })
    );

    res.json({
      success: true,
      count: clients.length,
      data: clientsWithStats,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// GET SINGLE CLIENT
// ─────────────────────────────────────────
const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id).lean();

    if (!client) {
      const err = new Error("Client not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// CREATE CLIENT
// ─────────────────────────────────────────
const createClient = async (req, res, next) => {
  try {
    const { company_name, country, entity_type, contact_email } = req.body;

    if (!company_name || !country || !entity_type) {
      const err = new Error(
        "company_name, country, and entity_type are required"
      );
      err.statusCode = 400;
      return next(err);
    }

    const client = await Client.create({
      company_name,
      country,
      entity_type,
      contact_email,
    });

    res.status(201).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// DELETE CLIENT + TASKS
// ─────────────────────────────────────────
const deleteClientAndTasks = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      const err = new Error("Client not found");
      err.statusCode = 404;
      return next(err);
    }

    await Task.deleteMany({ client_id: req.params.id });
    await client.deleteOne();

    res.json({
      success: true,
      message: "Client and all associated tasks deleted",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllClientsWithStats,
  getClientById,
  createClient,
  deleteClientAndTasks,
};