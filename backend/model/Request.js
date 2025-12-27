const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  subject: String,
  type: {
    type: String,
    enum: ["Corrective", "Preventive"]
  },
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment"
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  assignedTo: String,
  status: {
    type: String,
    enum: ["New", "In Progress", "Repaired", "Scrap"],
    default: "New"
  },
  scheduledDate: Date,
  duration: Number,

  // 🔥 NEW
  isOverdue: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", RequestSchema);
