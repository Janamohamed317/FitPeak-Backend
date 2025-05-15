const mongoose = require('mongoose');
const Joi = require('joi');

const userProfileSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
  },
  height: {
    type: Number,
    required: true,
    min: 30,
    max: 300,
  },
  weight: {
    type: Number,
    required: true,
    min: 2,
    max: 500,
  }
}, {
  timestamps: true,
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

function validateUserProfile(data) {
  const schema = Joi.object({
    userID: Joi.string().trim().required().messages({
      'any.required': 'User ID is required.',
      'string.empty': 'User ID cannot be empty.'
    }),
    age: Joi.number().min(1).max(120).required().messages({
      'number.base': 'Age must be a number.',
      'number.min': 'Age must be at least 1.',
      'number.max': 'Age must be no more than 120.',
      'any.required': 'Age is required.'
    }),
    height: Joi.number().min(30).max(300).required().messages({
      'number.base': 'Height must be a number.',
      'number.min': 'Height must be at least 30 cm.',
      'number.max': 'Height must be no more than 300 cm.',
      'any.required': 'Height is required.'
    }),
    weight: Joi.number().min(2).max(500).required().messages({
      'number.base': 'Weight must be a number.',
      'number.min': 'Weight must be at least 2 kg.',
      'number.max': 'Weight must be no more than 500 kg.',
      'any.required': 'Weight is required.'
    })
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = {
  UserProfile,
  validateUserProfile,
};
