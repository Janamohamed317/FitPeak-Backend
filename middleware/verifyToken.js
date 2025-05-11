const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

const verifyTokenAndUserCheck = async (req, res, next) => {
	const token = req.cookies.token;

	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		req.userId = decoded.userId;

		const user = await User.findById(req.userId)
			.select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		req.user = user;


	} catch (error) {

		return res.status(500).json({ success: false, message: "Server error" });
	}
};



module.exports = {
	verifyTokenAndUserCheck,
};