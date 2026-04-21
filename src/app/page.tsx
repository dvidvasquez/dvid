export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Feed Principal</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Este `page.tsx` sera el timeline combinado de blog, viajes y proyectos.
        </p>
      </header>
      <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Base lista para conectar las ultimas entradas y renderizarlas en orden
          cronologico.
        </p>
      </section>
    </main>
  );
}
