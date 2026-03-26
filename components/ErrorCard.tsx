"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorCard({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorCardProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface border border-border rounded-xl p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-negative/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-negative" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Analysis Failed
        </h2>
        <p className="text-sm text-text-secondary mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
