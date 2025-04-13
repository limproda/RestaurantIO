import User from "../Models/UserModel.js";
import {} from "dotenv/config";
import jwt from "jsonwebtoken";

export const userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(401).json({ status: false, message: "Invalid token" });
      }

      const user = await User.findById(data.id);
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      // Si todo está bien, devuelve el usuario o continúa con la ejecución
      return res.status(200).json({ status: true, user: user.email });
    });
  } catch (error) {
    console.error("Error in userVerification middleware:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};