import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    ctc: {
      type: String,
      required: true,
      trim: true,
    },

    minCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    eligibleBranches: [
      {
        type: String,
        enum: ["CSE", "CSE-AI", "IT", "ECE", "EEE", "MECH", "CIVIL"],
      },
    ],

    maxBacklogs: {
      type: Number,
      default: 0,
      min: 0,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    interviewDates: [
      {
        stage: {
          type: String,
          enum: ["Round 1", "Round 2", "HR"],
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],

    rounds: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Company = model("Company", companySchema);