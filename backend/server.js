import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/companies", companyRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/students", studentRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    console.log("MongoDB Connected");

    try {
      const studentCollection = mongoose.connection.db.collection("students");
      const indexes = await studentCollection.indexes();
      const hasRollIndex = indexes.some((index) => index.name === "rollNumber_1");

      if (hasRollIndex) {
        await studentCollection.dropIndex("rollNumber_1");
        console.log("Dropped old rollNumber unique index");
      }

      await studentCollection.createIndex(
        { section: 1, rollNumber: 1 },
        { unique: true }
      );
      console.log("Ensured unique student index on section + rollNumber");
    } catch (indexErr) {
      console.error("Failed to ensure student indexes", indexErr);
    }
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});