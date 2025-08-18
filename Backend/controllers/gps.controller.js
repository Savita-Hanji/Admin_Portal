// In your backend route file (e.g., routes/gps.js)
const express = require("express");
const router = express.Router();
const GPS = require("../models/gps"); // Your GPS model

// Get latest GPS data for a device
router.get("/:deviceId", async (req, res) => {
  try {
    const latestData = await GPS.findOne({ deviceId: req.params.deviceId })
      .sort({ timestamp: -1 })
      .limit(1);

    if (!latestData) {
      return res
        .status(404)
        .json({ message: "No GPS data found for this device" });
    }

    res.json({
      success: true,
      data: latestData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching GPS data", error: error.message });
  }
});

module.exports = router;
