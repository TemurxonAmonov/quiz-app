import { connectDB } from "../../utils/db";
import { Quiz } from "../../models/Quiz";

export default defineEventHandler(async () => {
  await connectDB();

  const quizzes = await Quiz.find().select("title createdAt").sort({ createdAt: -1 });
  return quizzes;
});
