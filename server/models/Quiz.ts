import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: Number, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
  },
  { timestamps: true },
);

export const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
