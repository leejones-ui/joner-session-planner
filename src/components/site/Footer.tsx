import { JFMonogram } from "@/components/brand/JFMonogram";

export function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-zinc-900 no-print">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <JFMonogram className="w-8 h-8" />
          <div>
            <p className="text-sm font-semibold text-zinc-200">Joner Football</p>
            <p className="text-xs text-zinc-500">Made for coaches.</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-sm text-zinc-400">
          <a href="https://jonerfootball.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200">jonerfootball.com</a>
          <a href="/samples" className="hover:text-zinc-200">Samples</a>
        </div>
      </div>
    </footer>
  );
}
