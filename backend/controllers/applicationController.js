import { Application }
from "../models/application.js";

import { Company }
from "../models/company.js";

import { Student }
from "../models/student.js";

export const applyCompany =
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
          message:
            "Student not found",
        });
      }

      if (
        student.cgpa <
        company.minCGPA
      ) {
        return res.status(400).json({
          message:
            "CGPA not eligible",
        });
      }

      if (
        !company.eligibleBranches.includes(
          student.branch
        )
      ) {
        return res.status(400).json({
          message:
            "Branch not eligible",
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

      const application =
        await Application.create({
          student: student._id,
          company: company._id,
        });

      res.status(201).json(
        application
      );
    } catch (err) {
      res.status(500).json(err);
    }
  };

export const myApplications =
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
          .populate("student")
          .populate("company");

      res.json(applications);
    } catch (err) {
      res.status(500).json(err);
    }
  };

export const getAllApplications =
  async (req, res) => {
    try {
      const applications =
        await Application.find()
          .populate("student")
          .populate("company");

      res.json(applications);
    } catch (err) {
      res.status(500).json(err);
    }
  };

export const updateApplicationStatus =
  async (req, res) => {
    try {
      const updatedApplication =
        await Application.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(
        updatedApplication
      );
    } catch (err) {
      res.status(500).json(err);
    }
  };