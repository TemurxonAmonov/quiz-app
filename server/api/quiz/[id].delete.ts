import { connectDB } from "../../utils/db";
import { Quiz } from "../../models/Quiz";
import { Result } from "../../models/Result";

export default defineEventHandler(async (event) => {
  await connectDB();

  const user = event.context.user;
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Admin only" });
  }

  const id = getRouterParam(event, "id");

  const quiz = await Quiz.findByIdAndDelete(id);
  if (!quiz) {
    throw createError({ statusCode: 404, statusMessage: "Quiz not found" });
  }

  await Result.deleteMany({ quizId: id });

  return { success: true };
});
