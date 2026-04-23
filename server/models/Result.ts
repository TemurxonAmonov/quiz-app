import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    studentName: { type: String, required: true, trim: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);
