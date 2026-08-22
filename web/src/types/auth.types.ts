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

export type { RegisterFormI, LoginFormI };
