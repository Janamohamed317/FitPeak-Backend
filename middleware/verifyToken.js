const jwt = require("jsonwebtoken");
const {User} =require("../models/user.model");

const verifyTokenAndUserCheck = async(req, res, next) => {
	const token = req.cookies.token;
  
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

    req.userId = decoded.userId;
		req.isAdmin = decoded.isAdmin;

    // Check if the user exists
		const user = await User.findById(req.userId)
      .select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		req.user = user; // Attach the user to the request
    
		next();
    
	} catch (error) {
		
		return res.status(500).json({ success: false, message: "Server error" });
	}
};


// Verify Token & Check if is Admin
const verifyAndAdminCheck  = (req, res, next) => {
    verifyTokenAndUserCheck(req, res, () => {
    if (req.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
  });
}

module.exports = {
  verifyTokenAndUserCheck,
  verifyAndAdminCheck,
};