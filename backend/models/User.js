import mongoose, {
  Schema,
  model,
} from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

export const User = model(
  "User",
  userSchema
);