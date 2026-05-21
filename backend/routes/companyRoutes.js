import express from "express";

import { Company } from "../models/Company.js";
import { Student } from "../models/Student.js";
import { Application } from "../models/Application.js";
import { sendEmailToStudents } from "../utils/email.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post(
  "/add-company",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const company = await Company.create(req.body);

      const students = await Student.find().populate("user");

      const emailText = `A new company has been added for placement drive:\n\nCompany: ${company.companyName}\nRole: ${company.jobRole}\nCTC: ${company.ctc}\nMinimum CGPA: ${company.minCGPA}\nEligible Branches: ${company.eligibleBranches.join(", ")}\nMax Backlogs: ${company.maxBacklogs}\nRegistration Deadline: ${company.registrationDeadline.toDateString()}\n`;

      sendEmailToStudents(
        students,
        `New Placement Drive: ${company.companyName}`,
        emailText,
        `<p>${emailText.replace(/\n/g, "<br />")}</p>`
      ).catch((err) => {
        console.error("Failed to send new company announcement emails", err);
      });

      res.status(201).json(company);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const companies =
      await Company.find();

    res.json(companies);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const company =
      await Company.findById(
        req.params.id
      );

    res.json(company);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const updatedCompany =
        await Company.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      res.json(updatedCompany);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const deletedCompany = await Company.findByIdAndDelete(
        req.params.id
      );

      if (!deletedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }

      await Application.deleteMany({ company: req.params.id });

      res.json({
        message: "Company deleted and related applications removed",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default router;