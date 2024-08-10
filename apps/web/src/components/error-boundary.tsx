"use client";

import { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface ErrorBoundaryProps {
  errorMessage?: string;
  children: ReactNode;
}

interface ErrorFallbackProps {
  message?: string;
}

function ErrorFallback({ message }: ErrorFallbackProps) {
  return (
    <span aria-label="Error on component" className="text-sm text-center font-semibold text-red-600">
      {message}
    </span>
  );
}

export function ErrorBoundary({ children, errorMessage }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary FallbackComponent={() => <ErrorFallback message={errorMessage} />}>
      {children}
    </ReactErrorBoundary>
  );
}
