import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  address: z.string().min(1, { message: "Address is required" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
  categories: z
    .array(z.string())
    .min(1, { message: "Select at least one category" }),
});
