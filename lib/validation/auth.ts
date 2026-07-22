import { z } from "zod";

const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .regex(/[A-Z]/, "Include at least one uppercase letter.")
  .regex(/[0-9]/, "Include at least one number.");

export const signUpSchema = z
  .object({
    displayName: z.string().trim().min(2, "Tell us what to call you.").max(60),
    email: z.email("Enter a valid email address."),
    password,
    confirmPassword: z.string(),
    role: z.enum(["student", "teacher"], {
      message: "Choose whether you're joining as a student or a teacher.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(2).max(60),
  schoolName: z.string().trim().max(120).optional().or(z.literal("")),
  graduationYear: z.coerce.number().int().min(2020).max(2035).optional(),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
});
