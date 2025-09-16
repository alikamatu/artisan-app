"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Something went wrong!
      </h2>
      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
