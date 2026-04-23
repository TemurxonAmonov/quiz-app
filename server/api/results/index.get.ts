import { connectDB } from "../../utils/db";
import { Result } from "../../models/Result";

export default defineEventHandler(async (event) => {
  await connectDB();

  const user = event.context.user;
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Admin only" });
  }

  const results = await Result.find().populate("quizId", "title").sort({ createdAt: -1 });

  return results.map((item: any) => ({
    _id: item._id,
    studentName: item.studentName,
    quizTitle: item.quizId?.title || "Unknown Quiz",
    score: item.score,
    total: item.total,
    createdAt: item.createdAt,
  }));
});
