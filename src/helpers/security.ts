import bcrypt from "bcrypt"

import { logError } from "./logger"

export async function hashPassword(password: string) {
  try {
    return await bcrypt.hash(password, 10)
  } catch (err) {
    logError(err as Error)
  }
}

export async function verifyPassword(password: string, hash: string) {
  try {
    return await bcrypt.compare(password, hash)
  } catch (err) {
    logError(err as Error)
  }
}