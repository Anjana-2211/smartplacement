import { Company }
from "../models/company.js";

export const addCompany =
  async (req, res) => {
    try {
      const company =
        await Company.create(
          req.body
        );

      res.status(201).json(
        company
      );
    } catch (err) {
      res.status(500).json(err);
    }
  };

export const getCompanies =
  async (req, res) => {
    try {
      const companies =
        await Company.find();

      res.json(companies);
    } catch (err) {
      res.status(500).json(err);
    }
  };

export const getSingleCompany =
  async (req, res) => {
    try {
      const company =
        await Company.findById(
          req.params.id
        );

      res.json(company);
    } catch (err) {
      res.status(500).json(err);
    }
  };

export const updateCompany =
  async (req, res) => {
    try {
      const updatedCompany =
        await Company.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(
        updatedCompany
      );
    } catch (err) {
      res.status(500).json(err);
    }
  };

export const deleteCompany =
  async (req, res) => {
    try {
      await Company.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Company Deleted",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  };