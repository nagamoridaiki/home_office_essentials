/** バックエンド Role enum の value と一致 */
export type Role = "admin" | "teacher" | "student" | "hr";

export type Account = {
  id: string;
  email: string;
  role: Role | null;
};

const TOKEN_KEY = "mock_auth_token";
const USER_INFO_KEY = "mock_user_info";

export const SessionManager = {
  getToken(): string {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("No authentication token found");
    return token;
  },

  getInfo(): Account | undefined {
    const raw = localStorage.getItem(USER_INFO_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as Account;
  },

  isSignedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  setAuthentication(userId: string, account: Account): void {
    localStorage.setItem(TOKEN_KEY, userId);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(account));
  },

  /** トークンとユーザー情報のみ削除（画面遷移は呼び出し側で行う） */
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  },

  logout(returnTo?: string): void {
    SessionManager.clearSession();
    if (returnTo) {
      window.location.href = returnTo;
    } else {
      window.location.reload();
    }
  },
};
