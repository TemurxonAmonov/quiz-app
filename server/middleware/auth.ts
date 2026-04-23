import { verifyToken } from "../utils/auth";
import { connectDB } from "../utils/db";
import { User } from "../models/User";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const method = getMethod(event);

  const isProtected = url.pathname === "/api/auth/me" || url.pathname === "/api/results" || url.pathname === "/api/quiz/create" || url.pathname.endsWith("/edit") || (url.pathname.startsWith("/api/quiz/") && ["PUT", "DELETE"].includes(method));

  if (!isProtected) return;

  const token = getCookie(event, "token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const { id } = verifyToken(token);
    await connectDB();
    const user = await User.findById(id).select("-password");
    if (!user) throw new Error();
    event.context.user = user;
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }
});
