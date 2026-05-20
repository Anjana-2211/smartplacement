import express from "express";

import { Application } from "../models/application.js";
import { Company } from "../models/Company.js";
import { Student } from "../models/Student.js";
import { sendEmail } from "../utils/email.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post(
  "/apply/:companyId",
  verifyToken,
  async (req, res) => {
    try {
      const student =
        await Student.findOne({
          user: req.user.id,
        });

      const company =
        await Company.findById(
          req.params.companyId
        );

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      if (
        student.cgpa < company.minCGPA
      ) {
        return res.status(400).json({
          message: "CGPA not eligible",
        });
      }

      if (
        !company.eligibleBranches.includes(
          student.branch
        )
      ) {
        return res.status(400).json({
          message: "Branch not eligible",
        });
      }

      const existingApplication =
        await Application.findOne({
          student: student._id,
          company: company._id,
        });

      if (existingApplication) {
        return res.status(400).json({
          message:
            "Already Applied",
        });
      }

      const application = await Application.create({
        student: student._id,
        company: company._id,
      });

      if (student.user?.email) {
        const emailText = `Your application for ${company.companyName} is confirmed.\n\nRole: ${company.jobRole}\nCTC: ${company.ctc}\nCurrent status: ${application.status}`;
        sendEmail({
          to: student.user.email,
          subject: `Application Confirmed: ${company.companyName}`,
          text: emailText,
          html: `<p>${emailText.replace(/\n/g, "<br />")}</p>`,
        }).catch((err) => {
          console.error("Failed to send application confirmation email", err);
        });
      }

      res.status(201).json(application);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get(
  "/my-applications",
  verifyToken,
  async (req, res) => {
    try {
      const student =
        await Student.findOne({
          user: req.user.id,
        });

      const applications =
        await Application.find({
          student: student._id,
        })
          .populate("company")
          .populate("student");

      res.json(applications);
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
      const applications =
        await Application.find()
          .populate({
            path: "student",
            populate: { path: "user" },
          })
          .populate("company");

      res.json(applications);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.put(
  "/status/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const updatedApplication = await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      )
        .populate({
          path: "student",
          populate: { path: "user" },
        })
        .populate("company");

      if (updatedApplication?.student?.user?.email) {
        const emailText = `Your application status for ${updatedApplication.company.companyName} has been updated to ${updatedApplication.status}.`;
        sendEmail({
          to: updatedApplication.student.user.email,
          subject: `Application Status Updated: ${updatedApplication.company.companyName}`,
          text: emailText,
          html: `<p>${emailText.replace(/\n/g, "<br />")}</p>`,
        }).catch((err) => {
          console.error("Failed to send application status email", err);
        });
      }

      res.json(updatedApplication);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default router;