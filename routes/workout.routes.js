const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { Workout, validateWorkout } = require("../models/workout.model");
const asyncHandler = require("express-async-handler");

// Create a new workout
router.post("/", asyncHandler(async (req, res) => {
  const { error } = validateWorkout(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const workout = new Workout({
      workoutId: uuidv4(),
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      exercises: req.body.exercises,
      duration: req.body.duration,
      date: req.body.date,
      completed: req.body.completed,
      category: req.body.category,
      calories: req.body.calories, 
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    console.error("Error creating workout:", err);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء التمرين" });
  }
}));

router.get("/user/:userId", asyncHandler(async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب التمارين" });
  }
}));



router.delete("/:workoutId", asyncHandler(async (req, res) => {
  try {
    const workout = await Workout.findOne({ workoutId: req.params.workoutId });
    
    if (!workout) {
      return res.status(404).json({ message: "التمرين غير موجود" });
    }
    
 

    await Workout.findOneAndDelete({ workoutId: req.params.workoutId });
    res.json({ message: "تم حذف التمرين بنجاح" });
  } catch (err) {
    console.error("Error deleting workout:", err);
    res.status(500).json({ message: "حدث خطأ أثناء حذف التمرين" });
  }
}));



module.exports = router;
