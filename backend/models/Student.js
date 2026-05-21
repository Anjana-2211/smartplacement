import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      enum: ["A", "B", "C"],
    },

    branch: {
      type: String,
      required: true,
      enum: ['CSE', 'CSE-AI', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    backlogs: {
      type: Number,
      default: 0,
      min: 0,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ section: 1, rollNumber: 1 }, { unique: true });

export const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);