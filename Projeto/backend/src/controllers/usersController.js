import User from "../models/user.js";
import { sanitizeInput } from "../utils/sanitize.js";
export const me = async (req, res) => {
  try {
    const u = await User.findById(req.user?.id).select("-passwordHash");
    if (!u) return res.status(404).json({ error: "Not found" });
    return res.json(u);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
export const updateMe = async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const updated = await User.findByIdAndUpdate(req.user?.id, body, { new: true }).select("-passwordHash");
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
