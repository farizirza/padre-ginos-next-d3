import "server-only";
import { cache } from "react";
import { getSession } from "./session";
import { findUserById } from "./users";
import type { User } from "./types";

// Data Access Layer: the only place that turns a cookie into a user.
// cache() makes every call in the same request share one lookup.
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const { userId } = await getSession();
  if (!userId) return null;
  // The cookie says who; the database says what they are allowed (role)
  return findUserById(userId);
});

export function isDevLoginEnabled(): boolean {
  return process.env.AUTH_DEV_LOGIN === "1";
}