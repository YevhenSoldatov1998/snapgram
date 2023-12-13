import * as z from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, {message: 'Too short'}).max(20),
  username: z.string().min(2, {message: 'Too short'}),
  email: z.string().email(),
  password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
})

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
})

export const PostValidation = z.object({
  caption: z.string(),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string()

})
