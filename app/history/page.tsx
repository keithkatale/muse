import { GenerationHistoryView } from "@/components/history/generation-history-view"

export const metadata = {
  title: "History — Muse",
  description: "Browse your previously generated artwork.",
}

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl">
          Generation History
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Revisit past creations and continue to print options.
        </p>
      </div>
      <GenerationHistoryView />
    </div>
  )
}
