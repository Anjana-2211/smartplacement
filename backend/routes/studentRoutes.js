import express from "express";

import { Student } from "../models/Student.js";
import { Company } from "../models/Company.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get(
  "/profile",
  verifyToken,
  async (req, res) => {
    try {
      const student = await Student.findOne({
        user: req.user.id,
      }).populate("user");

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get(
  "/eligible",
  verifyToken,
  async (req, res) => {
    try {
      const student = await Student.findOne({
        user: req.user.id,
      });

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      const companies = await Company.find({
        minCGPA: { $lte: student.cgpa },
        eligibleBranches: student.branch,
        maxBacklogs: { $gte: student.backlogs },
      }).sort({ registrationDeadline: 1 });

      res.json({ student, companies });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get(
  "/all",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const students = await Student.find().populate({
        path: "user",
        match: { role: "student" }
      });
      const filteredStudents = students.filter(student => student.user !== null);
      res.json(filteredStudents);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default router;