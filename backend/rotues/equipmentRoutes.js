const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");

router.post("/", async (req, res) => {
  const equipment = new Equipment(req.body);
  await equipment.save();
  res.json(equipment);
});

router.get("/", async (req, res) => {
  const data = await Equipment.find();
  res.json(data);
});

module.exports = router;

