"use client";

import { Loader } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <div className="relative">
        <Loader className="w-10 h-10 text-blue-500 animate-spin" />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full"></div>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}
