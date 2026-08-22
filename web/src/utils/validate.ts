import * as z from "zod";

const emailRule = z
  .string()
  .min(1, "authPage.validation.email.required")
  .email("authPage.validation.email.invalid");

const passwordRule = z
  .string()
  .min(1, "authPage.validation.password.required")
  .min(8, "authPage.validation.password.min")
  .regex(/[a-zA-Z]/, "authPage.validation.password.hasLetter")
  .regex(/[0-9]/, "authPage.validation.password.hasNumber");

export const forgotPasswordSchema = z.object({
  email: emailRule,
});

export const loginSchema = z.object({
  email: emailRule,
  password: passwordRule,
});

export const registerSchema = loginSchema
  .extend({
    firstName: z
      .string()
      .min(1, "authPage.validation.firstName.required")
      .min(2, "authPage.validation.firstName.min"),
    lastName: z
      .string()
      .min(1, "authPage.validation.lastName.required")
      .min(5, "authPage.validation.lastName.min"),
    phone: z
      .string()
      .min(1, "authPage.validation.phone.required")
      .regex(
        /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
        "authPage.validation.phone.invalid",
      ),
    role: z.string().min(1, "authPage.validation.role.required"),
    confirmPassword: z
      .string()
      .min(1, "authPage.validation.confirmPassword.required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "authPage.validation.confirmPassword.mismatch",
    path: ["confirmPassword"],
  });

export type FormErrors = Record<string, string>;

export const validationForm = <T>(
  schema: z.ZodSchema<T>,
  formData: unknown,
  setErrors: (errors: FormErrors) => void,
): boolean => {
  const result = schema.safeParse(formData);

  if (result.success) {
    setErrors({});
    return true;
  }

  const newErrors: FormErrors = {};

  result.error.issues.forEach((issue) => {
    const fieldName = issue.path[0];
    if (fieldName && !newErrors[String(fieldName)]) {
      newErrors[String(fieldName)] = issue.message;
    }
  });

  setErrors(newErrors);
  return false;
};
