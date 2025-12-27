const express = require("express");
const router = express.Router();

const Request = require("../models/Request");
const Equipment = require("../models/Equipment");
const User = require("../models/User");

/**
 * CREATE MAINTENANCE REQUEST
 * - Corrective: Any user
 * - Preventive: Manager only
 * - Auto technician assignment
 * - Overdue detection
 */
router.post("/", async (req, res) => {
  try {
    const { subject, type, equipmentId, scheduledDate, role } = req.body;

    // 🔒 Manager-only preventive
    if (type === "Preventive" && role !== "Manager") {
      return res.status(403).json({
        message: "Only managers can create preventive maintenance requests"
      });
    }

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (equipment.isScrapped) {
      return res.status(400).json({
        message: "This equipment is scrapped and cannot be serviced"
      });
    }

    // 🔧 AUTO-ASSIGN TECHNICIAN (least workload)
    const technician = await User.findOne({ role: "Technician" })
      .sort({ activeJobs: 1 });

    if (!technician) {
      return res.status(400).json({ message: "No technician available" });
    }

    technician.activeJobs += 1;
    await technician.save();

    // ⏰ Overdue detection
    let isOverdue = false;
    if (scheduledDate && new Date(scheduledDate) < new Date()) {
      isOverdue = true;
    }

    const request = new Request({
      subject,
      type,
      equipmentId,
      teamId: equipment.maintenanceTeamId,
      assignedTo: technician.name,
      scheduledDate,
      isOverdue,
      status: "New"
    });

    await request.save();
    res.status(201).json(request);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET ALL REQUESTS (KANBAN)
 */
router.get("/", async (req, res) => {
  const requests = await Request.find()
    .populate("equipmentId")
    .populate("teamId");
  res.json(requests);
});

/**
 * GET PREVENTIVE REQUESTS (CALENDAR)
 */
router.get("/preventive", async (req, res) => {
  const data = await Request.find({ type: "Preventive" })
    .populate("equipmentId");
  res.json(data);
});

/**
 * UPDATE REQUEST STATUS (TECHNICIAN UX)
 */
router.put("/:id/status", async (req, res) => {
  try {
    const { status, duration } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;

    if (status === "Repaired") {
      request.duration = duration || 0;

      // 🔁 Reduce technician workload
      const tech = await User.findOne({ name: request.assignedTo });
      if (tech && tech.activeJobs > 0) {
        tech.activeJobs -= 1;
        await tech.save();
      }
    }

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
