import type { Metadata } from "next";
import { Search } from "lucide-react";
import { searchReferenceEntries } from "@/lib/content/reference-library";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Java Reference Library" };

export default async function ReferenceLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const entries = searchReferenceEntries(q);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Java Reference Library</h1>
        <p className="mt-1 text-foreground-muted">Searchable syntax, methods, and common errors.</p>
      </div>

      <form method="get" className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
        <Input name="q" defaultValue={q} placeholder="Search the reference library…" className="pl-10" aria-label="Search reference library" />
      </form>

      <div className="flex flex-col gap-4">
        {entries.length === 0 ? (
          <p className="text-sm text-foreground-muted">No entries match &quot;{q}&quot;.</p>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="amber">{entry.category}</Badge>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold text-foreground">{entry.name}</h2>
              <p className="mt-2 text-sm text-foreground-muted">{entry.definition}</p>
              <pre className="mt-4 overflow-x-auto rounded-md bg-surface-code p-4 font-mono text-sm text-parchment">{entry.syntax}</pre>
              <pre className="mt-3 overflow-x-auto rounded-md bg-surface-code p-4 font-mono text-sm text-parchment">{entry.example}</pre>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{entry.lineByLine}</p>
              <div className="mt-4 rounded-md border border-amber/20 bg-amber/5 p-3 text-xs text-amber">
                Common mistake: {entry.commonMistake}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
