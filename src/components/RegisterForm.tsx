"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { readSavedCode } from "@/lib/storage";

function subscribeSavedCode() {
  return () => undefined;
}

type RegisterFormProps = {
  configured: boolean;
};

export function RegisterForm({ configured }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const savedCode = useSyncExternalStore(
    subscribeSavedCode,
    readSavedCode,
    () => null,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!configured) {
      setError(
        "Club Nonna todavía no está conectado. Pide a Nonna que termine la configuración.",
      );
      return;
    }

    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("El WhatsApp debe tener 10 dígitos, sin 52 ni lada extra.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp: digits }),
      });
      const data = (await response.json()) as {
        code?: string;
        existing?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !data.code) {
        setError(data.error ?? "No se pudo crear la tarjeta.");
        return;
      }

      if (data.existing && data.message) {
        setNotice(data.message);
      }

      router.push(`/lealtad/${data.code}`);
    } catch {
      setError("No hubo conexión. Inténtalo otra vez.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      {savedCode ? (
        <Link
          href={`/lealtad/${savedCode}`}
          className="rounded-2xl border border-blue/20 bg-cream-dark px-4 py-3 text-center text-sm font-medium text-navy"
        >
          Abrir mi tarjeta
        </Link>
      ) : null}

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium">Tu nombre</span>
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={60}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Como te gusta que te llamen"
          className="h-12 rounded-2xl border border-blue/15 bg-white px-4 text-base text-navy outline-none ring-navy/20 placeholder:text-blue/40 focus:ring-2"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium">WhatsApp</span>
        <div className="flex overflow-hidden rounded-2xl border border-blue/15 bg-white focus-within:ring-2 focus-within:ring-navy/20">
          <span className="flex items-center bg-cream-dark px-3 text-sm text-blue">
            +52
          </span>
          <input
            name="whatsapp"
            inputMode="numeric"
            autoComplete="tel"
            required
            maxLength={12}
            value={whatsapp}
            onChange={(event) =>
              setWhatsapp(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="10 dígitos"
            className="h-12 w-full bg-transparent px-4 text-base text-navy outline-none placeholder:text-blue/40"
          />
        </div>
        <span className="text-xs text-blue">
          Si ya te registraste, usamos la misma tarjeta.
        </span>
      </label>

      {error ? (
        <p className="rounded-2xl bg-navy px-4 py-3 text-sm text-cream" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className="text-sm text-blue">{notice}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="h-13 rounded-full bg-navy px-5 py-3.5 text-base font-semibold text-cream disabled:opacity-60"
      >
        {pending ? "Abriendo tu tarjeta…" : "Quiero mi tarjeta"}
      </button>
    </form>
  );
}
