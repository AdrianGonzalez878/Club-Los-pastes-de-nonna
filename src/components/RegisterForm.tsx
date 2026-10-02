"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon, CheckNoteIcon } from "@/components/LoyaltyIcons";
import { SavedCardLink } from "@/components/SavedCardLink";

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
    <form onSubmit={onSubmit} className="cn-form">
      <div className="cn-field">
        <label htmlFor="cn-nombre" className="cn-field-label">
          Tu nombre
        </label>
        <input
          id="cn-nombre"
          name="name"
          type="text"
          autoComplete="given-name"
          required
          minLength={2}
          maxLength={60}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Cómo te gusta que te llamen"
          className="cn-input"
        />
      </div>

      <div className="cn-field">
        <label htmlFor="cn-whatsapp" className="cn-field-label">
          WhatsApp
          <span className="sr-only">, código de país más 52</span>
        </label>
        <div className="cn-phone">
          <span className="cn-cc" aria-hidden="true">
            +52
          </span>
          <input
            id="cn-whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            maxLength={10}
            value={whatsapp}
            onChange={(event) =>
              setWhatsapp(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="10 dígitos"
            className="cn-input"
            aria-describedby="cn-whatsapp-note"
          />
        </div>
      </div>

      <p className="cn-note" id="cn-whatsapp-note">
        <CheckNoteIcon />
        Si ya te registraste, usamos la misma tarjeta
      </p>

      {error ? (
        <p className="cn-alert" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className="cn-notice">{notice}</p> : null}

      <button type="submit" disabled={pending} className="cn-btn cn-btn-blue cn-btn-block">
        {pending ? "Abriendo tu tarjeta…" : "Quiero mi tarjeta"}
        {pending ? null : <ArrowIcon className="cn-ico" />}
      </button>
      <SavedCardLink className="cn-btn cn-btn-sand cn-btn-block">
        Abrir mi tarjeta
      </SavedCardLink>
    </form>
  );
}
