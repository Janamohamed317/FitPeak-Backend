const express = require('express');
const router = express.Router();
const { UserProfile, validateUserProfile } = require('../models/UserProfile.model');

router.post('/save', async (req, res) => {
  const { error } = validateUserProfile(req.body);
  if (error) {
    const messages = error.details.map(e => e.message);
    return res.status(400).json({ error: messages });
  }

  const { userID, age, height, weight } = req.body;

  try {
    const updated = await UserProfile.findOneAndUpdate(
      { userID },
      { age, height, weight },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'Profile saved successfully.', data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});


router.get('/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const profile = await UserProfile.findOne({ userID });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    res.status(200).json({ data: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
