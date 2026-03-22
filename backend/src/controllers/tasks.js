const Task = require("../models/Task");
const Client = require("../models/Client");

// ─────────────────────────────────────────
// GET TASKS BY CLIENT WITH FILTERS
// ─────────────────────────────────────────
const getTasksByClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const {
      status,
      category,
      priority,
      overdue,
      search,
      sort = "due_date",
    } = req.query;

    // check client exists
    const client = await Client.findById(clientId).lean();
    if (!client) {
      const err = new Error("Client not found");
      err.statusCode = 404;
      return next(err);
    }

    const filter = { client_id: clientId };

    if (status && status !== "All") filter.status = status;
    if (category && category !== "All") filter.category = category;
    if (priority && priority !== "All") filter.priority = priority;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (overdue === "true") {
      filter.status = { $in: ["Pending", "In Progress"] };
      filter.due_date = { $lt: new Date() };
    }

    const sortMap = {
      due_date: { due_date: 1 },
      due_date_desc: { due_date: -1 },
      priority: { priority: -1 },
      created: { createdAt: -1 },
      title: { title: 1 },
    };

    const sortQuery = sortMap[sort] || { due_date: 1 };

    const tasks = await Task.find(filter).sort(sortQuery).lean();

    const now = new Date();
    const tasksWithFlag = tasks.map((t) => ({
      ...t,
      is_overdue:
        t.status !== "Completed" &&
        t.status !== "Cancelled" &&
        new Date(t.due_date) < now,
    }));

    // stats
    const allTasks = await Task.find({ client_id: clientId }).lean();

    const stats = {
      total: allTasks.length,
      pending: allTasks.filter((t) => t.status === "Pending").length,
      in_progress: allTasks.filter((t) => t.status === "In Progress").length,
      completed: allTasks.filter((t) => t.status === "Completed").length,
      overdue: allTasks.filter(
        (t) =>
          t.status !== "Completed" &&
          t.status !== "Cancelled" &&
          new Date(t.due_date) < now
      ).length,
    };

    res.json({
      success: true,
      count: tasksWithFlag.length,
      stats,
      data: tasksWithFlag,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// CREATE TASK
// ─────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { client_id, title, description, category, due_date, priority } =
      req.body;

    if (!client_id || !title || !category || !due_date) {
      const err = new Error(
        "client_id, title, category, and due_date are required"
      );
      err.statusCode = 400;
      return next(err);
    }

    const client = await Client.findById(client_id);
    if (!client) {
      const err = new Error("Client not found");
      err.statusCode = 404;
      return next(err);
    }

    const task = await Task.create({
      client_id,
      title,
      description,
      category,
      due_date,
      priority,
    });

    const taskObj = task.toObject();
    taskObj.is_overdue =
      task.status !== "Completed" &&
      task.status !== "Cancelled" &&
      task.due_date < new Date();

    res.status(201).json({ success: true, data: taskObj });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// UPDATE TASK STATUS
// ─────────────────────────────────────────
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "In Progress", "Completed", "Cancelled"];

    if (!status) {
      const err = new Error("status field is required");
      err.statusCode = 400;
      return next(err);
    }

    if (!validStatuses.includes(status)) {
      const err = new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
      err.statusCode = 400;
      return next(err);
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!task) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      return next(err);
    }

    const now = new Date();
    task.is_overdue =
      task.status !== "Completed" &&
      task.status !== "Cancelled" &&
      new Date(task.due_date) < now;

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// DELETE TASK
// ─────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasksByClient,
  createTask,
  updateTaskStatus,
  deleteTask,
};