import { ExternalLink } from "lucide-react";

interface ErrorDisplayProps {
  error: unknown;              // accept anything
  refetch: () => void;
}

const ErrorDisplay = ({ error, refetch }: ErrorDisplayProps) => {
  // Normalize error into a human-readable message
  let message = "Something went wrong";

  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "object" && error !== null) {
    // Try common error shapes (e.g., Axios, fetch, etc.)
    if ("message" in error && typeof (error as any).message === "string") {
      message = (error as any).message;
    } else if ("error" in error && typeof (error as any).error === "string") {
      message = (error as any).error;
    } else {
      try {
        message = JSON.stringify(error);
      } catch {
        message = "Unknown error";
      }
    }
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-sm">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-red-600 mb-4">{message}</p>
        <button
          onClick={refetch}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
