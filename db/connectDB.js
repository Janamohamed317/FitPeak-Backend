const mongoose = require("mongoose");
async function connectDB () {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected To MongoDB...");
	} catch (error) {
				console.log("Error connection to MongoDB: ", error.message);
		process.exit(1);
	}
};

module.exports = connectDB;