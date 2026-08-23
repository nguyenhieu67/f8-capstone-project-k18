interface RegisterFormI {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  confirmPassword: string;
}

interface LoginFormI {
  email: string;
  password: string;
}

interface MeI {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserI extends MeI {
  phone?: string;
  role?: "authorized" | "admin";
  avatarUrl?: string;
}

export type { RegisterFormI, LoginFormI, MeI, UserI };
