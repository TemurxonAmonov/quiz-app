import { connectDB } from "../../utils/db";
import { Quiz } from "../../models/Quiz";

export default defineEventHandler(async (event) => {
  await connectDB();

  const user = event.context.user;
  if (user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Admin only" });
  }

  const body = await readBody(event);
  const { title, timeLimit, questions } = body;

  if (!title || !questions || !questions.length) {
    throw createError({ statusCode: 400, statusMessage: "Title and questions are required" });
  }

  if (timeLimit !== undefined && timeLimit !== null && (!Number.isInteger(timeLimit) || timeLimit < 1)) {
    throw createError({ statusCode: 400, statusMessage: "timeLimit must be a positive integer" });
  }

  const quiz = await Quiz.create({ title, timeLimit, questions });
  return quiz;
});
