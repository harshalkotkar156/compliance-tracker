const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Tax Filing",
          "GST",
          "ROC Filing",
          "Audit",
          "Payroll",
          "TDS",
          "Annual Return",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    due_date: {
      type: Date,
      required: [true, "Due date is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed", "Cancelled"],
        message: "{VALUE} is not a valid status",
      },
      default: "Pending",
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High", "Critical"],
        message: "{VALUE} is not a valid priority",
      },
      default: "Medium",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast filtered queries
taskSchema.index({ client_id: 1, status: 1 });
taskSchema.index({ client_id: 1, due_date: 1 });

module.exports = mongoose.model("Task", taskSchema);