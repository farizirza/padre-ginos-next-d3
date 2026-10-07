import type { Metadata } from "next";
import { Suspense } from "react";
import ProfileForm from "@/components/ProfileForm";
import { requireUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";

export const metadata: Metadata = { title: "Akun saya — Padre Gino's" };

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-lg">
      <h1 className="text-3xl font-black">Akun saya</h1>
      <Suspense fallback={<AccountFallback />}>
        <AccountContent />
      </Suspense>
    </section>
  );
}

async function AccountContent() {
  const user = await requireUser();

  return (
    <>
      <p className="mt-1 text-sm text-ink/60">
        @{user.login} · {ROLE_LABELS[user.role]}
      </p>
      <ProfileForm
        profile={{
          name: user.name,
          phone: user.phone,
          address: user.address,
        }}
      />
    </>
  );
}

function AccountFallback() {
  return (
    <div className="mt-4 space-y-4">
      <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
      <div className="h-48 w-full animate-pulse rounded-lg bg-stone-200" />
    </div>
  );
}
