const express = require("express");
const router = express.Router();
const { Goal, validateGoal } = require("../models/Goals.model");

// Add a new goal
router.post("/add", async (req, res) => {
  const { error } = validateGoal(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const goal = new Goal({
      userId: req.body.userId,
      goal: req.body.goal,
      progress: req.body.progress,
    });

    await goal.save();
    res.status(201).send(goal);
  } catch (err) {
    res.status(500).send({ message: "Server Error" });
  }
});

// Get all goals for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.send(goals);
  } catch (err) {
    res.status(500).send({ message: "Error fetching goals" });
  }
});

module.exports = router;
