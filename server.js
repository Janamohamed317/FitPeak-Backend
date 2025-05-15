const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
require("dotenv").config();
const connectDB = require("./db/connectDB");
const authRoutes = require("./routes/auth.routes");
const goalRoutes = require("./routes/Goals.routes");
const workoutRoutes = require("./routes/workout.routes");
const cookieParser = require('cookie-parser');

const app = express(); 

// Middleware
app.use(express.json()); 
app.use(cookieParser());

app.use(helmet());

app.use(cors({ origin: "http://localhost:5174", credentials: true }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/workouts", workoutRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});



