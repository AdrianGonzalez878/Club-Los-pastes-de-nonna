export function ConfigBanner() {
  return (
    <aside className="rounded-2xl border border-blue/20 bg-paper px-4 py-3 text-sm leading-6 text-navy">
      <p className="font-semibold">Todavía no está conectado</p>
      <p className="mt-1 text-blue">
        Faltan las llaves de Supabase o los secretos de caja. Copia{" "}
        <code className="rounded bg-cream px-1">.env.example</code> a{" "}
        <code className="rounded bg-cream px-1">.env.local</code> y pega{" "}
        <code className="rounded bg-cream px-1">supabase/schema.sql</code> en el
        SQL Editor. La interfaz sigue aquí; las visitas se guardan cuando
        termine la conexión.
      </p>
    </aside>
  );
}
