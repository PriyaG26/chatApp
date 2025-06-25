// src/controllers/delete.controller.js
import User from "../models/user.model.js";

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Optional: Check if the ID from token matches the ID in the route (prevent one user deleting another)
    // if (req.user._id !== userId) {
    //   return res.status(403).json({ message: "Unauthorized to delete this account." });
    // }
    if (req.user._id.toString() !== userId) {
  return res.status(403).json({ message: "Unauthorized to delete this account." });
}


    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user." });
  }
};
