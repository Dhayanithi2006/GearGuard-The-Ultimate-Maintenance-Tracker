const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: {
    type: String,
    enum: ["User", "Technician", "Manager"]
  },
  activeJobs: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("User", UserSchema);
