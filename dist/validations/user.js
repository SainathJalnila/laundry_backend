import { z } from 'zod';
const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    mobile_number: z.string().min(1, "Mobile number is required"),
    country_code: z.string().min(1, "Country code is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
const loginSchema = z.object({
    mobile_number: z.string().min(1, "Mobile number is required"),
    country_code: z.string().min(1, "Country code is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
export { registerSchema, loginSchema };
