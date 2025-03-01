"use client";

import { useState, useEffect } from "react";
import { History, Trash2 } from "lucide-react";

interface AddressHistoryProps {
  onSelectAddress: (address: string) => void;
}

export default function AddressHistory({
  onSelectAddress,
}: AddressHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("soneium-history");
        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("soneium-history");
    }
  };

  if (history.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        <History className="h-3 w-3 mr-1" />
        History
        <span className="ml-1 bg-blue-500 text-white dark:bg-blue-600 rounded-full text-[10px] px-1.5">
          {history.length}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-8 right-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-sm">
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">
              Recently Checked
            </h4>
            <button
              onClick={clearHistory}
              className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto scrollbar-thin">
            {history.map((address, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded cursor-pointer"
                onClick={() => {
                  onSelectAddress(address);
                  setIsOpen(false);
                }}
              >
                <span className="font-mono text-xs text-gray-600 dark:text-gray-300 truncate">
                  {address.slice(0, 10)}...{address.slice(-6)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
