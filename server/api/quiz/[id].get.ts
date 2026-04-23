import { connectDB } from "../../utils/db";
import { Quiz } from "../../models/Quiz";

export default defineEventHandler(async (event) => {
  await connectDB();

  const id = getRouterParam(event, "id");

  const quiz = await Quiz.findById(id).select("-questions.answer");
  if (!quiz) {
    throw createError({ statusCode: 404, statusMessage: "Quiz not found" });
  }

  return quiz;
});
