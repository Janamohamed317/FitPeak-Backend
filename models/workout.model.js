const mongoose = require("mongoose");
const Joi = require("joi");

const workoutSchema = new mongoose.Schema(
  {
    workoutId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      maxlength: 500,
      trim: true,
    },
    exercises: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        sets: {
          type: Number,
          required: true,
          min: 1,
        },
        reps: {
          type: Number,
          required: true,
          min: 1,
        },
        weight: {
          type: Number,
          required: false,
        },
        duration: {
          type: Number, // in minutes
          required: false,
        },
        notes: {
          type: String,
          required: false,
          trim: true,
        }
      }
    ],
    duration: {
      type: Number, // total duration in minutes
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ["strength", "cardio", "flexibility", "balance", "other"],
      default: "other",
    },
    calories: {
      type: Number,
      required: false,
      min: 0
    }
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);

function validateWorkout(data) {
  const exerciseSchema = Joi.object({
    name: Joi.string().trim().required(),
    sets: Joi.number().integer().min(1).required(),
    reps: Joi.number().integer().min(1).required(),
    weight: Joi.number().optional(),
    duration: Joi.number().optional(),
    notes: Joi.string().trim().optional()
  });

  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().max(500).allow('', null).optional(),
    exercises: Joi.array().items(exerciseSchema).min(1).required(),
    duration: Joi.number().optional(),
    date: Joi.date().optional(),
    completed: Joi.boolean().optional(),
    category: Joi.string().valid("strength", "cardio", "flexibility", "balance", "other").optional(),
    calories: Joi.number().min(0).optional(),
    userId: Joi.string().required(),
  });

  return schema.validate(data);
}

module.exports = {
  Workout,
  validateWorkout,
};
