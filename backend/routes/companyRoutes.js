import express from "express";

import { Company } from "../models/Company.js";
import { Student } from "../models/Student.js";
import { Application } from "../models/Application.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post(
  "/add-company",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { sendEmailToStudents } =
      await import("../utils/email.js");
      const company = await Company.create(req.body);

      // Query only eligible students: branch matches, CGPA >= minCGPA, and backlogs <= maxBacklogs
      const students = await Student.find({
        branch: { $in: company.eligibleBranches },
        cgpa: { $gte: company.minCGPA },
        backlogs: { $lte: company.maxBacklogs ?? 0 },
      }).populate("user");

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const companyUrl = `${frontendUrl}/companies/${company._id}`;

      const emailText = `A new company matching your eligibility criteria has been added for the placement drive:\n\n` +
        `Company: ${company.companyName}\n` +
        `Role: ${company.jobRole}\n` +
        `CTC: ${company.ctc}\n` +
        `Minimum CGPA: ${company.minCGPA}\n` +
        `Eligible Branches: ${company.eligibleBranches.join(", ")}\n` +
        `Max Backlogs: ${company.maxBacklogs ?? 0}\n` +
        `Registration Deadline: ${new Date(company.registrationDeadline).toDateString()}\n\n` +
        `Click here to apply: ${companyUrl}\n`;

      const emailHtml = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e4e7; border-radius: 16px;">` +
        `<h2 style="color: #08060d; margin-top: 0;">New Placement Drive Match!</h2>` +
        `<p style="color: #6b6375; font-size: 16px; line-height: 1.5;">` +
        `Hi there, a new company matching your eligibility criteria has been added to the placement drive. Here are the details:` +
        `</p>` +
        `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">` +
        `<tr style="border-bottom: 1px solid #e5e4e7;"><td style="padding: 10px 0; font-weight: bold; color: #08060d;">Company</td><td style="padding: 10px 0; color: #6b6375; text-align: right;">${company.companyName}</td></tr>` +
        `<tr style="border-bottom: 1px solid #e5e4e7;"><td style="padding: 10px 0; font-weight: bold; color: #08060d;">Role</td><td style="padding: 10px 0; color: #6b6375; text-align: right;">${company.jobRole}</td></tr>` +
        `<tr style="border-bottom: 1px solid #e5e4e7;"><td style="padding: 10px 0; font-weight: bold; color: #08060d;">CTC</td><td style="padding: 10px 0; color: #6b6375; text-align: right;">${company.ctc}</td></tr>` +
        `<tr style="border-bottom: 1px solid #e5e4e7;"><td style="padding: 10px 0; font-weight: bold; color: #08060d;">Min CGPA Required</td><td style="padding: 10px 0; color: #6b6375; text-align: right;">${company.minCGPA}</td></tr>` +
        `<tr style="border-bottom: 1px solid #e5e4e7;"><td style="padding: 10px 0; font-weight: bold; color: #08060d;">Eligible Branches</td><td style="padding: 10px 0; color: #6b6375; text-align: right;">${company.eligibleBranches.join(", ")}</td></tr>` +
        `<tr style="border-bottom: 1px solid #e5e4e7;"><td style="padding: 10px 0; font-weight: bold; color: #08060d;">Max Backlogs Allowed</td><td style="padding: 10px 0; color: #6b6375; text-align: right;">${company.maxBacklogs ?? 0}</td></tr>` +
        `<tr style="border-bottom: 1px solid #e5e4e7;"><td style="padding: 10px 0; font-weight: bold; color: #08060d;">Deadline</td><td style="padding: 10px 0; color: #6b6375; text-align: right; font-weight: 600;">${new Date(company.registrationDeadline).toDateString()}</td></tr>` +
        `</table>` +
        `<div style="text-align: center; margin: 30px 0 10px;">` +
        `<a href="${companyUrl}" style="display: inline-block; background: linear-gradient(135deg, #aa3bff, #8028d9); color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(170, 59, 255, 0.35);">Apply Now</a>` +
        `</div>` +
        `<p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 20px;">` +
        `If the button doesn't work, copy this link to your browser: <br/>` +
        `<a href="${companyUrl}" style="color: #aa3bff;">${companyUrl}</a>` +
        `</p>` +
        `</div>`;

      await sendEmailToStudents(
  students,
  `Eligible Placement Drive: ${company.companyName}`,
  emailText,
  emailHtml
);

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