const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { mongoURI } = require("./config");

const equipmentRoutes = require("./routes/equipmentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const requestRoutes = require("./routes/requestRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/equipment", equipmentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/requests", requestRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
