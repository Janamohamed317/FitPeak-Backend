const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
require("dotenv").config();
const connectDB = require("./db/connectDB");
const { notFound, errorHanlder } = require("./middleware/errors");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json()); 
app.use(cookieParser());

app.use(helmet());

app.use(cors({ origin: "http://localhost:5175", credentials: true }));

// Routes
app.use("/api/v1/auth", authRoutes);

// Error Hanlder Middleware
app.use(notFound);
app.use(errorHanlder);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});



