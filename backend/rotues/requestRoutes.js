const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const Equipment = require("../models/Equipment");

/**
 * CREATE MAINTENANCE REQUEST
 * - Corrective: Any logged-in user
 * - Preventive: ONLY Manager
 */
router.post("/", async (req, res) => {
  try {
    const {
      subject,
      type,
      equipmentId,
      scheduledDate,
      assignedTo,
      role // role sent from frontend
    } = req.body;

    // 🔒 ROLE CHECK FOR PREVENTIVE MAINTENANCE
    if (type === "Preventive" && role !== "Manager") {
      return res.status(403).json({
        message: "Only managers can create preventive maintenance requests"
      });
    }

    // 🔍 Fetch equipment to auto-fill team
    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // ❌ Block requests if equipment is scrapped
    if (equipment.isScrapped) {
      return res.status(400).json({
        message: "This equipment is scrapped and cannot be serviced"
      });
    }

    // ✅ Create request with auto-filled team
    const request = new Request({
      subject,
      type,
      equipmentId,
      teamId: equipment.maintenanceTeamId,
      assignedTo,
      scheduledDate
    });

    await request.save();
    res.status(201).json(request);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET ALL MAINTENANCE REQUESTS (KANBAN)
 */
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("equipmentId")
      .populate("teamId");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET PREVENTIVE MAINTENANCE (CALENDAR VIEW)
 */
router.get("/preventive", async (req, res) => {
  try {
    const preventive = await Request.find({ type: "Preventive" })
      .populate("equipmentId");

    res.json(preventive);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * UPDATE REQUEST STATUS (KANBAN DRAG & DROP)
 */
router.put("/:id/status", async (req, res) => {
  try {
    const { status, duration } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;

    // Save repair duration when completed
    if (status === "Repaired") {
      request.duration = duration || 0;
    }

    // Scrap logic
    if (status === "Scrap") {
      const equipment = await Equipment.findById(request.equipmentId);
      equipment.isScrapped = true;
      await equipment.save();
    }

    await request.save();
    res.json(request);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
