const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    entity_type: {
      type: String,
      required: [true, "Entity type is required"],
      enum: {
        values: [
          "Private Limited",
          "Public Limited",
          "LLP",
          "Partnership",
          "Sole Proprietorship",
          "Trust",
          "NGO",
          "Other",
        ],
        message: "{VALUE} is not a valid entity type",
      },
    },
    contact_email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", clientSchema);