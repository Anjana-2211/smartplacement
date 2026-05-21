import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.js";
import { Student } from "../models/student.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      section,
      rollNumber,
      branch,
      cgpa,
      backlogs,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    if (!["admin", "student"].includes(role)) {
      return res.status(400).json({
        message: "Role must be either admin or student",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (role === "student") {
      if (!rollNumber || !branch || !section) {
        return res.status(400).json({
          message: "Section, roll number and branch are required for students",
        });
      }

      if (!["A", "B", "C"].includes(section)) {
        return res.status(400).json({
          message: "Section must be A, B, or C",
        });
      }

      const existingStudentWithRoll = await Student.findOne({
        section,
        rollNumber,
      });

      if (existingStudentWithRoll) {
        return res.status(400).json({
          message: "Roll number already registered for this section",
        });
      }

      const parsedCgpa = parseFloat(cgpa);
      const parsedBacklogs = Number(backlogs);

      if (Number.isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
        return res.status(400).json({
          message: "CGPA must be a number between 0 and 10",
        });
      }

      if (
        Number.isNaN(parsedBacklogs) ||
        parsedBacklogs < 0 ||
        !Number.isInteger(parsedBacklogs)
      ) {
        return res.status(400).json({
          message: "Backlogs must be a whole number greater than or equal to 0",
        });
      }

      try {
        await Student.create({
          section,
          rollNumber,
          branch,
          cgpa: parsedCgpa,
          backlogs: parsedBacklogs,
          user: user._id,
        });
      } catch (studentErr) {
        await User.findByIdAndDelete(user._id);
        if (studentErr.code === 11000) {
          return res.status(400).json({
            message: "Roll number already registered for this section",
          });
        }
        throw studentErr;
      }
    }

    res.status(201).json({
      message: "User Registered",
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        message:
          err.keyPattern?.section && err.keyPattern?.rollNumber
            ? "Roll number already registered for this section"
            : "Duplicate registration data",
      });
    }

    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;