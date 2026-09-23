"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push(searchParams.get("from") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-card">
      <h1 className="text-xl font-medium">Admin</h1>
      <p className="mt-1 text-sm text-muted">Enter the password to manage site content.</p>

      <input
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent-blue"
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading || !password}
        className="mt-4 w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-50"
      >
        {loading ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      {/* useSearchParams() needs a Suspense boundary or static export fails. */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
