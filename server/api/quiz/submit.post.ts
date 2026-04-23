import { connectDB } from "../../utils/db";
import { Quiz } from "../../models/Quiz";
import { Result } from "../../models/Result";

export default defineEventHandler(async (event) => {
  await connectDB();

  const body = await readBody(event);
  const { quizId, answers, studentName } = body;

  if (!quizId || !answers || !studentName) {
    throw createError({ statusCode: 400, statusMessage: "quizId, answers and studentName are required" });
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw createError({ statusCode: 404, statusMessage: "Quiz not found" });
  }

  let score = 0;
  const total = quiz.questions.length;

  quiz.questions.forEach((q: any, i: number) => {
    if (answers[i] === q.answer) score++;
  });

  const saved = await Result.create({
    quizId,
    studentName,
    score,
    total,
  });

  return {
    _id: saved._id,
    studentName: saved.studentName,
    score: saved.score,
    total: saved.total,
    createdAt: saved.createdAt,
  };
});
