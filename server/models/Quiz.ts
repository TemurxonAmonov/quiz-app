import mongoose from "mongoose";

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface QuizDocument {
  title: string;
  timeLimit?: number;
  questions: Question[];
}

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: Number, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    timeLimit: { type: Number, min: 1 },
    questions: { type: [questionSchema], required: true },
  },
  { timestamps: true },
);

export const Quiz = (mongoose.models.Quiz as mongoose.Model<QuizDocument>) || mongoose.model<QuizDocument>("Quiz", quizSchema);
