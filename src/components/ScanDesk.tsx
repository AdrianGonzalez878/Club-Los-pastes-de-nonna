"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { extractCodeFromScan, formatCode, isValidCode } from "@/lib/codes";
import { LOCATIONS, type LocationId } from "@/lib/locations";
import type { CardSnapshot } from "@/lib/types";

type StaffView = {
  locationId: LocationId;
  locationName: string;
};

type ScanDeskProps = {
  configured: boolean;
  initialSession: StaffView | null;
};

export function ScanDesk({ configured, initialSession }: ScanDeskProps) {
  const [session, setSession] = useState<StaffView | null>(initialSession);
  const [locationId, setLocationId] = useState<LocationId>(
    initialSession?.locationId ?? "centro",
  );
  const [pin, setPin] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [card, setCard] = useState<CardSnapshot | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [scanning, setScanning] = useState(Boolean(initialSession));
  const lastScan = useRef("");
  const scannerRef = useRef<{
    stop: () => Promise<void>;
    clear: () => Promise<void> | void;
  } | null>(null);

  const lookup = useCallback(async (raw: string) => {
    const code = extractCodeFromScan(raw);
    if (!isValidCode(code) || lastScan.current === code) return;
    lastScan.current = code;
    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/staff/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await response.json()) as {
        card?: CardSnapshot;
        error?: string;
      };
      if (!response.ok || !data.card) {
        setCard(null);
        setError(data.error ?? "No encontramos esa tarjeta.");
        lastScan.current = "";
        return;
      }
      setCard(data.card);
      setManualCode(formatCode(data.card.code));
    } catch {
      setError("No hubo conexión con el servidor.");
      lastScan.current = "";
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !scanning) {
      return;
    }

    let cancelled = false;

    async function startCamera() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const scanner = new Html5Qrcode("club-qr-reader");
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 8, qrbox: { width: 220, height: 220 } },
          (decoded) => {
            void lookup(decoded);
          },
          () => undefined,
        );
        if (!cancelled) setCameraError("");
      } catch {
        if (!cancelled) {
          setCameraError(
            "No se pudo abrir la cámara. Escribe el código a mano.",
          );
        }
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        void scanner.stop().catch(() => undefined);
        void scanner.clear();
      }
    };
  }, [lookup, scanning, session]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!configured) {
      setError(
        "Club Nonna todavía no está conectado. Faltan las variables de entorno.",
      );
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, pin }),
      });
      const data = (await response.json()) as {
        locationId?: LocationId;
        locationName?: string;
        error?: string;
      };
      if (!response.ok || !data.locationId || !data.locationName) {
        setError(data.error ?? "No se pudo entrar.");
        return;
      }
      setSession({
        locationId: data.locationId,
        locationName: data.locationName,
      });
      setScanning(true);
      setPin("");
    } catch {
      setError("No hubo conexión con el servidor.");
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    await fetch("/api/staff/logout", { method: "POST" });
    setSession(null);
    setCard(null);
    setScanning(false);
    setNotice("");
    lastScan.current = "";
  }

  async function act(path: "/api/staff/visit" | "/api/staff/redeem") {
    if (!card) return;
    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: card.code }),
      });
      const data = (await response.json()) as {
        card?: CardSnapshot;
        message?: string;
        error?: string;
      };
      if (!response.ok || !data.card) {
        setError(data.error ?? "No se pudo completar.");
        return;
      }
      setCard(data.card);
      setNotice(data.message ?? "Listo.");
    } catch {
      setError("No hubo conexión con el servidor.");
    } finally {
      setPending(false);
    }
  }

  if (!session) {
    return (
      <form onSubmit={login} className="flex flex-col gap-5">
        <fieldset className="grid gap-3">
          <legend className="mb-1 text-sm font-medium">Sucursal</legend>
          {LOCATIONS.map((location) => (
            <label
              key={location.id}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 ${
                locationId === location.id
                  ? "border-navy bg-white"
                  : "border-blue/15 bg-cream-dark"
              }`}
            >
              <input
                type="radio"
                name="location"
                value={location.id}
                checked={locationId === location.id}
                onChange={() => setLocationId(location.id)}
                className="accent-navy"
              />
              <span className="font-medium">{location.name}</span>
            </label>
          ))}
        </fieldset>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">PIN de caja</span>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            className="h-12 rounded-2xl border border-blue/15 bg-white px-4 text-base outline-none ring-navy/20 focus:ring-2"
          />
        </label>

        {error ? (
          <p className="rounded-2xl bg-navy px-4 py-3 text-sm text-cream" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-navy px-5 py-3.5 font-semibold text-cream disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Entrar a caja"}
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-blue">Caja</p>
          <p className="font-serif text-2xl">{session.locationName}</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-full border border-blue/20 px-4 py-2 text-sm"
        >
          Salir
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-navy">
        <div id="club-qr-reader" className="min-h-56 w-full bg-navy" />
      </div>
      {cameraError ? (
        <p className="text-sm text-blue">{cameraError}</p>
      ) : (
        <p className="text-center text-sm text-blue">
          Apunta la cámara al QR del cliente
        </p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          lastScan.current = "";
          void lookup(manualCode);
        }}
        className="flex gap-2"
      >
        <input
          value={manualCode}
          onChange={(event) => setManualCode(event.target.value.toUpperCase())}
          placeholder="O escribe el código"
          className="h-12 flex-1 rounded-2xl border border-blue/15 bg-white px-4 tracking-[0.16em] outline-none ring-navy/20 focus:ring-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-navy px-4 text-sm font-semibold text-cream"
        >
          Buscar
        </button>
      </form>

      {error ? (
        <p className="rounded-2xl bg-navy px-4 py-3 text-sm text-cream" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className="text-sm font-medium text-navy">{notice}</p> : null}

      {card ? (
        <section className="rounded-[2rem] bg-white/80 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue tabular-nums">
            {formatCode(card.code)}
          </p>
          <h2 className="mt-1 font-serif text-3xl">{card.name}</h2>
          <p className="mt-1 text-sm text-blue">{card.whatsappDisplay}</p>
          <div className="mt-4">
            <p className="font-sans text-2xl font-semibold tabular-nums">
              {card.stamps}/{card.visitsRequired}
            </p>
            <p className="text-sm text-blue">{card.promotionName}</p>
          </div>

          {card.canRedeem ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => void act("/api/staff/redeem")}
              className="mt-5 w-full rounded-full bg-navy px-5 py-3.5 font-semibold text-cream disabled:opacity-60"
            >
              Entregar paste gratis
            </button>
          ) : (
            <button
              type="button"
              disabled={pending || !card.canAddVisit}
              onClick={() => void act("/api/staff/visit")}
              className="mt-5 w-full rounded-full bg-navy px-5 py-3.5 font-semibold text-cream disabled:opacity-60"
            >
              {card.visitedToday
                ? "Hoy ya sumamos una visita"
                : pending
                  ? "Sumando…"
                  : "Sumar visita"}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setCard(null);
              setManualCode("");
              setNotice("");
              lastScan.current = "";
            }}
            className="mt-3 w-full rounded-full border border-blue/20 px-5 py-3 text-sm"
          >
            Escanear otra
          </button>
        </section>
      ) : null}
    </div>
  );
}
