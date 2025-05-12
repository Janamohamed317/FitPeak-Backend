const mongoose = require("mongoose");
const Joi = require("joi");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);

function validateGoal(data) {
  const schema = Joi.object({
    goal: Joi.string().trim().min(3).max(255).required(),
    progress: Joi.number().min(0).max(100).required(),
    userId: Joi.string().required(), 
  });

  return schema.validate(data);
}

module.exports = {
  Goal,
  validateGoal,
};
