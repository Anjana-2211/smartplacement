import { Student }
from "../models/Student.js";

export const getStudentProfile =
  async (req, res) => {
    try {
      const student =
        await Student.findOne({
          user: req.user.id,
        }).populate("user");

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  };