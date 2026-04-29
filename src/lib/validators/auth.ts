import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const signupSchema = z.object({
  username: z.string().min(2),
  education: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export const forgotSchema = z.object({
  email: z.string().email(),
})

export const resetSchema = z.object({
  password: z.string().min(6),
})