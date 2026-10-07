"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/auth";
import { profileSchema } from "@/lib/schemas";
import type { Profile } from "@/lib/types";
import { updateProfile } from "@/lib/users";

type Field = keyof Profile; // "name" | "phone" | "address"

export type ProfileFormState = {
  ok: boolean;
  errors: Partial<Record<Field | "form", string>>;
  // What the user typed, so the form can show it again after an error
  values: Record<Field, string>;
} | null;

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireUser();

  const values: Record<Field, string> = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
  };

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const errors: Partial<Record<Field | "form", string>> = {};
    if (fieldErrors.name?.[0]) errors.name = fieldErrors.name[0];
    if (fieldErrors.phone?.[0]) errors.phone = fieldErrors.phone[0];
    if (fieldErrors.address?.[0]) errors.address = fieldErrors.address[0];

    return {
      ok: false,
      errors,
      values,
    };
  }

  await updateProfile(user.id, parsed.data);
  refresh();

  return {
    ok: true,
    errors: {},
    values: {
      name: parsed.data.name,
      phone: parsed.data.phone ?? "",
      address: parsed.data.address ?? "",
    },
  };
}
