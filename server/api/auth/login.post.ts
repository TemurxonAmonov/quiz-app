import { connectDB } from "../../utils/db";
import { signToken } from "../../utils/auth";
import { User } from "../../models/User";

export default defineEventHandler(async (event) => {
  await connectDB();

  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: "Username and password are required" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
  }

  const token = signToken({ _id: user._id.toString() });

  setCookie(event, "token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return { user: { _id: user._id, username: user.username, role: user.role } };
});
