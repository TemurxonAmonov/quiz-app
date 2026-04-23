export function useAuth() {
  const user = useState<any>("user", () => null);

  async function login(username: string, password: string) {
    const data = await $fetch("/api/auth/login", {
      method: "POST",
      body: { username, password },
    });
    user.value = data.user;
    return data;
  }

  async function getUser() {
    try {
      const data = await $fetch("/api/auth/me");
      user.value = (data as any).user;
      return user.value;
    } catch {
      user.value = null;
      return null;
    }
  }

  async function logout() {
    // Clear cookie by setting expired
    const cookie = useCookie("token");
    cookie.value = null;
    user.value = null;
    navigateTo("/admin/login");
  }

  return { user, login, getUser, logout };
}
