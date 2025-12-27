const express = require("express");
const router = express.Router();
const Team = require("../models/Team");

router.post("/", async (req, res) => {
  const team = new Team(req.body);
  await team.save();
  res.json(team);
});

router.get("/", async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

module.exports = router;
