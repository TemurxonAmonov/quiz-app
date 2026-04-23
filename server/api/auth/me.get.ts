export default defineEventHandler(async (event) => {
  const user = event.context.user;
  return { user: { _id: user._id, username: user.username, role: user.role } };
});
