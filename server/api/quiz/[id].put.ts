import { connectDB } from "../../utils/db";
import { Quiz } from "../../models/Quiz";

export default defineEventHandler(async (event) => {
  await connectDB();

  const user = event.context.user;
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Admin only" });
  }

  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { title, timeLimit, questions } = body;

  if (!title || !questions || !questions.length) {
    throw createError({ statusCode: 400, statusMessage: "Title and questions are required" });
  }

  if (timeLimit !== undefined && timeLimit !== null && (!Number.isInteger(timeLimit) || timeLimit < 1)) {
    throw createError({ statusCode: 400, statusMessage: "timeLimit must be a positive integer" });
  }

  const quiz = await Quiz.findByIdAndUpdate(id, { title, timeLimit, questions }, { new: true, runValidators: true });

  if (!quiz) {
    throw createError({ statusCode: 404, statusMessage: "Quiz not found" });
  }

  return quiz;
});
