"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface DeleteAnalysisButtonProps {
  channelId: string;
  channelName: string;
  onDeleted: () => void;
}

export default function DeleteAnalysisButton({
  channelId,
  channelName,
  onDeleted,
}: DeleteAnalysisButtonProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/channels/${encodeURIComponent(channelId)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      onDeleted();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border hover:border-negative/50 hover:text-negative rounded-lg text-sm font-medium text-text-secondary transition-colors"
        title="Delete analysis"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !deleting && setOpen(false)}
          />

          <div className="relative w-full max-w-sm mx-4 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-negative/10 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-negative" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Delete Analysis</h3>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">
                Are you sure you want to delete the analysis for{" "}
                <strong className="text-text-primary">{channelName}</strong>? This will remove it
                from your recent analyses.
              </p>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-background/50">
              <button
                onClick={() => setOpen(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-surface border border-border hover:border-text-secondary/50 rounded-lg text-sm font-medium text-text-primary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-negative/10 border border-negative/30 hover:bg-negative/20 rounded-lg text-sm font-medium text-negative transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
