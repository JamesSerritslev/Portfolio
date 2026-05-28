import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(30),
  message: z
    .string()
    .trim()
    .min(10, "Please include a bit more detail in your message.")
    .max(5000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
