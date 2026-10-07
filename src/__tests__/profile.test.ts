import { describe, expect, it } from "vitest";
import { profileSchema } from "@/lib/schemas";

describe("profileSchema", () => {
  it("accepts valid full profile and trims/normalizes fields", () => {
    const result = profileSchema.safeParse({
      name: "  Citra Pelanggan  ",
      phone: "+62 812 3456 7890",
      address: "  Jl. Sudirman No. 1  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "Citra Pelanggan",
        phone: "+6281234567890",
        address: "Jl. Sudirman No. 1",
      });
    }
  });

  it("converts empty optional phone and address to null", () => {
    const result = profileSchema.safeParse({
      name: "Adi Admin",
      phone: "   ",
      address: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "Adi Admin",
        phone: null,
        address: null,
      });
    }
  });

  it("rejects short or blank names", () => {
    expect(profileSchema.safeParse({ name: "C", phone: "", address: "" }).success).toBe(false);
    expect(profileSchema.safeParse({ name: "   ", phone: "", address: "" }).success).toBe(false);
  });

  it("rejects invalid phone numbers", () => {
    expect(profileSchema.safeParse({ name: "Citra", phone: "12ab", address: "" }).success).toBe(false);
    expect(profileSchema.safeParse({ name: "Citra", phone: "12345", address: "" }).success).toBe(false);
  });

  it("rejects overly long address", () => {
    expect(
      profileSchema.safeParse({
        name: "Citra",
        phone: "",
        address: "a".repeat(201),
      }).success,
    ).toBe(false);
  });
});
