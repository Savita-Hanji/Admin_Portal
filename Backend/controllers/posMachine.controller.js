import PosMachine from "../models/posMachine.model.js";

// GET all POS machines
export const getAllPosMachines = async (req, res) => {
  try {
    const machines = await PosMachine.find();
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE new POS machine
export const createPosMachine = async (req, res) => {
  try {
    const { deviceId, model, vendor } = req.body;

    // Check if deviceId already exists
    const existing = await PosMachine.findOne({ deviceId });
    if (existing) {
      return res.status(400).json({ message: "Device ID already exists" });
    }

    const newMachine = new PosMachine({ deviceId, model, vendor });
    await newMachine.save();

    res.status(201).json(newMachine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE existing POS machine
export const updatePosMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const { deviceId, model, vendor } = req.body;

    const updatedMachine = await PosMachine.findByIdAndUpdate(
      id,
      { deviceId, model, vendor },
      { new: true }
    );

    if (!updatedMachine) {
      return res.status(404).json({ message: "POS Machine not found" });
    }

    res.status(200).json(updatedMachine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a POS machine
export const deletePosMachine = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PosMachine.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "POS Machine not found" });
    }

    res.status(200).json({ message: "POS Machine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
