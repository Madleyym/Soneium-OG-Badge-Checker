"use client";

import { AlertCircle } from "lucide-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import BadgeStatus from "./components/BadgeStatus";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Info,
  Loader,
  ChevronDown,
  Clock,
  Search,
  Save,
  Trash2,
  History,
  Moon,
  Sun,
  Award,
  Shield,
  Star,
  Gift,
  Check,
} from "lucide-react";
import Footer from "./components/sections/UI/Footer";
import FAQ from "./components/sections/FAQ";
const Icons = {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Info,
  Loader,
  ChevronDown,
  Clock,
  Search,
  Save,
  Trash2,
  History,
  Moon,
  Sun,
  Award,
  Shield,
  Star,
  Gift,
  Check,
};

// API Response interface
interface ApiResponse {
  found: boolean;
  transactions: number;
  premium: boolean;
  premiumReason: string;
  txStats?: {
    execute: number;
    withdraw: number;
    mint: number;
    getReward: number;
    multicall: number;
    other: number;
    failed: number;
  };
  _source: string;
  bridgeActivity?: any[];
  badges?: {
    ogBadge: boolean;
    premiumBadge: boolean;
  };
}

// Result Item interface
interface ResultItem {
  address: string;
  status: "success" | "error" | "notfound";
  message: string;
  transactions?: number;
  timestamp?: string;
  premium?: boolean;
  premiumReason?: string;
  txStats?: {
    execute?: number;
    withdraw?: number;
    mint?: number;
    getReward?: number;
    multicall?: number;
    other?: number;
    failed?: number;
  };
  badges?: {
    ogBadge: boolean;
    premiumBadge: boolean;
  };
}

export default function BadgeChecker() {
  // Validate Ethereum address
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Debounce function
  const debounce = <F extends (...args: any[]) => any>(
    func: F,
    waitFor: number
  ) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: Parameters<F>) => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };

    return debounced as (...args: Parameters<F>) => ReturnType<F>;
  };

  // App State
  const [isMobile, setIsMobile] = useState(false);
  const [addresses, setAddresses] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<ResultItem[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProcessing, setCurrentProcessing] = useState<string>("");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Refs
  const resultsRef = useRef<HTMLDivElement>(null);
  const addressInputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const historyButtonRef = useRef<HTMLButtonElement>(null);

  // Load saved state from localStorage on component mount - this needs to run only once
  useEffect(() => {
    // Check if running in browser environment
    if (typeof window !== "undefined") {
      // First check localStorage
      const savedDarkMode = localStorage.getItem("soneium-darkMode");

      if (savedDarkMode) {
        // Convert string to boolean
        const isDark = savedDarkMode === "true";
        setDarkMode(isDark);
        // Apply class directly for immediate effect
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // If no saved preference, check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setDarkMode(prefersDark);
        // Apply class directly for immediate effect
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

      // Load history
      const savedHistory = localStorage.getItem("soneium-history");
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Failed to parse history from localStorage");
        }
      }
    }
  }, []); // Empty dependency array ensures this runs only once

  // Toggle dark mode - Fixed implementation
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("soneium-darkMode", String(newMode));
      }

      // Apply dark mode class immediately for better UX
      if (typeof document !== "undefined") {
        if (newMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

      return newMode;
    });
  }, []);

  // Detect mobile device - improved to run only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640);
      };
      // Initial check
      checkMobile();
      // Add event listener
      window.addEventListener("resize", checkMobile);
      // Cleanup
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Auto-hide tip after 10 seconds
  useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => {
        setShowTip(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showTip]);

  // Scroll to results when they appear - using smooth scrolling with a fixed offset
  useEffect(() => {
    if (results.length > 0 && !isChecking && resultsRef.current) {
      // Use a fixed offset to prevent position shifts
      const yOffset = -20;
      const y =
        resultsRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }, [results, isChecking]);

  // Update filtered results when results or search query changes
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredResults(
        results.filter(
          (result) =>
            result.address.toLowerCase().includes(lowercasedQuery) ||
            result.status.toLowerCase().includes(lowercasedQuery) ||
            result.message.toLowerCase().includes(lowercasedQuery) ||
            (result.premiumReason &&
              result.premiumReason.toLowerCase().includes(lowercasedQuery))
        )
      );
    } else {
      setFilteredResults(results);
    }
  }, [results, searchQuery]);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && history.length > 0) {
      localStorage.setItem("soneium-history", JSON.stringify(history));
    }
  }, [history]);

  // Clean up any ongoing requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Close history dropdown when clicking outside
  useEffect(() => {
    if (!showHistory) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyButtonRef.current &&
        !historyButtonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".history-dropdown")
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHistory]);

  const checkWallet = async (address: string): Promise<ResultItem> => {
    try {
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // First validate address format
      if (!isValidAddress(address)) {
        return {
          address,
          status: "error",
          message: "Invalid address format",
          timestamp: new Date().toISOString(),
        };
      }

      const response = await fetch(`/api/check?address=${address}`, {
        signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const timestamp = new Date().toISOString();

      return {
        address,
        status: data.found ? "success" : "notfound",
        message: data.found ? `Found (${data.transactions} tx)` : "Not found",
        transactions: data.transactions || 0,
        premium: data.premium || false,
        premiumReason: data.premiumReason || "",
        timestamp,
        badges: data.badges || { ogBadge: false, premiumBadge: false },
      };
    } catch (error: any) {
      // Don't report error if it's an abort error
      if (error.name === "AbortError") {
        throw error; // Re-throw to handle in the caller
      }

      console.error("Error checking address:", error);
      return {
        address,
        status: "error",
        message: error.message || "Error checking address",
        timestamp: new Date().toISOString(),
      };
    }
  };

  // Update history when checking addresses
  const updateHistory = useCallback((addressList: string[]) => {
    // Only add valid addresses to history
    const validAddresses = addressList.filter(isValidAddress);

    if (validAddresses.length === 0) return;

    // Add to history, remove duplicates, and limit to 20 items
    setHistory((prevHistory) => {
      const newHistory = [...new Set([...validAddresses, ...prevHistory])];
      return newHistory.slice(0, 20);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("soneium-history");
    }
  }, []);

  const loadFromHistory = useCallback((address: string) => {
    setAddresses((prev) => (prev.trim() ? `${prev}\n${address}` : address));
    setShowHistory(false);
    if (addressInputRef.current) {
      addressInputRef.current.focus();
    }
  }, []);

  const handleCheck = async () => {
    const addressList = addresses
      .split("\n")
      .map((addr) => addr.trim())
      .filter((addr) => addr);

    if (!addressList.length) {
      setError("Please enter at least one wallet address");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Add to history
    updateHistory(addressList);

    setIsChecking(true);
    setResults([]);
    setProgress(0);
    setError(null);

    // Create a new AbortController for these batch of requests
    abortControllerRef.current = new AbortController();

    try {
      // Process in batches of 5 addresses for better performance
      const batchSize = 5;
      const totalBatches = Math.ceil(addressList.length / batchSize);

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStart = batchIndex * batchSize;
        const batchEnd = Math.min(batchStart + batchSize, addressList.length);
        const batch = addressList.slice(batchStart, batchEnd);

        // Show the batch being processed
        setCurrentProcessing(
          `Processing ${batchStart + 1}-${batchEnd} of ${addressList.length}`
        );

        // Process addresses in this batch concurrently
        const batchPromises = batch.map((address) => {
          setCurrentProcessing(address);
          return checkWallet(address);
        });

        const batchResults = await Promise.all(batchPromises);

        setResults((prevResults) => [...prevResults, ...batchResults]);

        // Update progress
        setProgress(Math.floor((batchEnd / addressList.length) * 100));
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Operation was cancelled");
      } else {
        console.error("Error during batch processing:", err);
        setError(`An error occurred: ${err.message || "Unknown error"}`);
      }
    } finally {
      setProgress(100);
      setCurrentProcessing("");
      setIsChecking(false);
      abortControllerRef.current = null;
    }
  };

  // Cancel ongoing operations
  const cancelCheck = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsChecking(false);
    setCurrentProcessing("");
    setError("Operation cancelled by user");
    setTimeout(() => setError(null), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Icons.CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 dark:text-green-400 shrink-0" />
        );
      case "notfound":
        return (
          <Icons.XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 dark:text-red-400 shrink-0" />
        );
      case "error":
        return (
          <Icons.AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 dark:text-yellow-400 shrink-0" />
        );
      default:
        return null;
    }
  };

  const getPremiumBadgeIcon = (premium: boolean, reason?: string) => {
    if (!premium) return null;

    return (
      <div className="relative" title={`Premium OG Badge: ${reason}`}>
        <Icons.Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 dark:text-amber-400 shrink-0" />
        <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-300 rounded-full animate-pulse"></div>
      </div>
    );
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const openExplorer = (address: string) => {
    window.open(`https://soneium.blockscout.com/address/${address}`, "_blank");
  };

  const openBadgeInventory = () => {
    window.open(
      `https://soneium.blockscout.com/token/0x2A21B17E366836e5FFB19bd47edB03b4b551C89d?tab=inventory`,
      "_blank"
    );
  };

  const downloadResults = () => {
    if (!results.length) return;

    const csvContent = [
      "Address,Status,Transactions,PremiumBadge,PremiumReason,OG_Badge_Received,Premium_Badge_Received,Timestamp",
      ...results.map(
        (r) =>
          `${r.address},${r.status},${r.transactions || 0},${
            r.premium || false
          },${r.premiumReason || ""},${r.badges?.ogBadge || false},${
            r.badges?.premiumBadge || false
          },${r.timestamp || ""}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `soneium-og-check-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("default", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Revised summary statistics calculation
  const summaryStats = useMemo(() => {
    if (!results.length)
      return {
        eligible: 0,
        notEligible: 0,
        errors: 0,
        premium: 0,
        eligiblePercent: 0,
        notEligiblePercent: 0,
        errorsPercent: 0,
        premiumPercent: 0,
        hasOgBadge: 0,
        hasPremiumBadge: 0,
        ogBadgePercent: 0,
        premiumBadgePercent: 0,
      };

    const eligible = results.filter((r) => r.status === "success").length;
    const notEligible = results.filter((r) => r.status === "notfound").length;
    const errors = results.filter((r) => r.status === "error").length;

    // Count all premium eligible addresses (either marked premium OR actually have a premium badge)
    const premium = results.filter(
      (r) => (r.premium || r.badges?.premiumBadge) && r.status === "success"
    ).length;

    // Count badge holders - consistent calculation
    const hasOgBadge = results.filter(
      (r) => r.badges?.ogBadge && r.status === "success"
    ).length;

    const hasPremiumBadge = results.filter(
      (r) => r.badges?.premiumBadge && r.status === "success"
    ).length;

    return {
      eligible,
      notEligible,
      errors,
      premium,
      hasOgBadge,
      hasPremiumBadge,
      eligiblePercent: Math.round((eligible / results.length) * 100) || 0,
      notEligiblePercent: Math.round((notEligible / results.length) * 100) || 0,
      errorsPercent: Math.round((errors / results.length) * 100) || 0,
      premiumPercent:
        eligible > 0 ? Math.round((premium / eligible) * 100) || 0 : 0,
      ogBadgePercent:
        eligible > 0 ? Math.round((hasOgBadge / eligible) * 100) || 0 : 0,
      premiumBadgePercent:
        premium > 0 ? Math.round((hasPremiumBadge / premium) * 100) || 0 : 0,
    };
  }, [results]);

  // Debounced search handler
  const handleSearchChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    300
  );

  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950 px-2 py-3 sm:p-4 md:p-8">
        <div className="space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 max-w-3xl w-full">
          {/* Header Section */}
          <div className="text-center mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="relative">
                  <div className="bg-blue-600 dark:bg-blue-500 p-1 sm:p-2 rounded-xl shadow-md transform -rotate-6">
                    <Image
                      src="/assets/icon.png"
                      alt="Soneium Logo"
                      width={28}
                      height={28}
                      className="sm:w-[36px] sm:h-[36px]"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                </div>
                <h1 className="ml-2 text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Soneium Badge Checker
                </h1>
              </div>

              <button
                onClick={toggleDarkMode}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full transition-colors"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <Icons.Sun className="w-5 h-5" />
                ) : (
                  <Icons.Moon className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-3 sm:p-4 rounded-xl border border-blue-100 dark:border-gray-600">
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Icons.Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                    OG Badge
                  </p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Icons.Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 dark:text-amber-400" />
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                    Premium OG Badge
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center mt-2 space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Snapshot taken at block{" "}
                    <span className="font-mono bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded text-blue-800 dark:text-blue-300">
                      #3747022
                    </span>
                  </p>
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    aria-label="Show information"
                  >
                    <Icons.Info className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  onClick={openBadgeInventory}
                  className="flex items-center space-x-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <Icons.ExternalLink className="h-3 w-3 mr-1" />
                  <span>View Badge Inventory</span>
                </button>
              </div>

              <div className="mt-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-2 text-xs text-green-800 dark:text-green-300 flex items-center justify-center text-center">
                <Icons.Gift className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Distribution complete! Check your badges ASAP!</span>
              </div>
            </div>
          </div>
          {/* Tip Section - Show initially and auto-hide */}
          {showTip && (
            <div className="bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-xs sm:text-sm text-blue-800 dark:text-blue-300 flex items-center justify-between">
              <div className="flex items-center">
                <Icons.Info className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  This tool now shows if badges have been received in addition
                  to checking eligibility
                </span>
              </div>
              <button
                onClick={() => setShowTip(false)}
                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                aria-label="Close tip"
              >
                <Icons.XCircle className="h-4 w-4" />
              </button>
            </div>
          )}
          {/* Information Panel - Update with block hash */}
          {showInfo && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-blue-800 dark:text-blue-300 relative">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                aria-label="Close information"
              >
                <Icons.XCircle className="h-4 w-4" />
              </button>

              {/* Standard OG Badge */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Icons.Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1.5" />
                  Soneium OG Badge
                </h3>
                <p className="mb-2">
                  The Soneium OG Badge is a special recognition for early
                  supporters and contributors to the Soneium ecosystem. A total
                  of 426,994 wallets are eligible to receive this Soulbound
                  Badge.
                </p>
                <div className="mt-2 text-xs bg-white dark:bg-gray-800 p-2 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="font-medium">Eligibility:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 pl-1">
                    <li>
                      Had transactions on the Soneium network before block
                      #3747022
                    </li>
                    <li>Minimum of 45 transactions required</li>
                  </ul>
                </div>
              </div>

              {/* Premium OG Badge */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Icons.Award className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1.5" />
                  Premium OG Badge
                </h3>
                <p className="mb-2">
                  The Premium OG Badge represents your outstanding commitment
                  and unwavering belief in Soneium. This special badge
                  recognizes users who went beyond to strengthen the foundation
                  of the ecosystem.
                </p>
                <div className="mt-2 text-xs bg-white dark:bg-gray-800 p-2 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="font-medium">
                    Eligibility (any of the following):
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1 pl-1">
                    <li>Bridged 1 ETH via the native bridge</li>
                    <li>Bridged ~70K ASTR (≈1 ETH) via Astar Network CCIP</li>
                    <li>Bridged $2.5K USDC via the native bridge</li>
                  </ul>
                </div>
              </div>

              <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                <p className="font-medium">Snapshot Details:</p>
                <div className="mt-1 font-mono text-[10px] sm:text-xs break-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-semibold">Block:</span>
                    <span>#3747022</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-semibold">Hash:</span>
                    <span className="break-all">
                      0x9c1a6ef0f3d4cf2ff5844ae0727cdc1c2888650bd6f62bd97e9f8ffa6b8ae430
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-1">
                    <span className="font-semibold">
                      Eligible Wallets (OG):
                    </span>
                    <span>426,994</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <Icons.Clock className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-semibold">
                  Last updated: March 04, 2025
                </span>
              </div>
              <div className="mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30 text-green-800 dark:text-green-300 text-xs">
                <div className="flex items-center">
                  <Icons.Check className="h-3.5 w-3.5 mr-1" />
                  <span>
                    Both badges have been fully distributed as of March 2, 2025
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm flex items-start">
              <Icons.AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0 mr-2" />
              <span>{error}</span>
            </div>
          )}
          {/* Input Section */}
          <div className="space-y-2 sm:space-y-3">
            <div className="relative">
              <div className="flex justify-end mb-1">
                <button
                  ref={historyButtonRef}
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Icons.History className="h-3 w-3 mr-1" />
                  History
                  {history.length > 0 && (
                    <span className="ml-1 bg-blue-500 text-white dark:bg-blue-600 rounded-full text-[10px] px-1.5">
                      {history.length}
                    </span>
                  )}
                </button>
              </div>

              {/* History Dropdown - Fixed positioning to prevent layout shifts */}
              {showHistory && (
                <div className="history-dropdown absolute top-8 right-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-sm">
                  <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                      Recently Checked
                    </h4>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center transition-colors"
                      disabled={history.length === 0}
                    >
                      <Icons.Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </button>
                  </div>

                  {history.length === 0 ? (
                    <div className="py-2 text-center text-gray-500 dark:text-gray-400 text-xs">
                      No history yet
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto">
                      {history.map((address, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded cursor-pointer transition-colors"
                          onClick={() => loadFromHistory(address)}
                        >
                          <span className="font-mono text-xs text-gray-600 dark:text-gray-300 truncate">
                            {address.slice(0, 10)}...{address.slice(-6)}
                          </span>
                          <button
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(address);
                            }}
                          >
                            <Icons.Copy className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <textarea
                ref={addressInputRef}
                value={addresses}
                onChange={(e) => setAddresses(e.target.value)}
                placeholder="wallet addresses (one per line)&#10;Example: 0x0..00"
                className="w-full h-24 sm:h-36 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 outline-none resize-none font-mono text-xs sm:text-sm shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                disabled={isChecking}
                style={{ fontSize: isMobile ? "12px" : "" }}
              />
              {addresses && (
                <div className="absolute right-3 bottom-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded-full shadow-sm border dark:border-gray-700">
                  {addresses.split("\n").filter((line) => line.trim()).length}{" "}
                  addresses
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleCheck}
                disabled={isChecking || !addresses.trim()}
                className="flex-grow py-3 sm:py-3.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-xl disabled:opacity-50 hover:from-blue-600 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 transition-all font-medium text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                {isChecking ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    <span>
                      Checking{" "}
                      {currentProcessing && (
                        <span className="font-mono">
                          {currentProcessing.includes("Processing")
                            ? currentProcessing
                            : `${currentProcessing.slice(
                                0,
                                6
                              )}...${currentProcessing.slice(-4)}`}
                        </span>
                      )}
                    </span>
                  </>
                ) : (
                  <span>Check Eligibility & Badges</span>
                )}
              </button>

              {isChecking && (
                <button
                  onClick={cancelCheck}
                  className="px-4 py-3 sm:py-3.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          {/* Progress Bar (visible when checking) - Fixed height to prevent layout shifts */}
          {isChecking && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          {/* Results Section */}
          {results.length > 0 && (
            <div
              ref={resultsRef}
              className="space-y-3 sm:space-y-4 mt-2 scroll-mt-4"
            >
              <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                <h2 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <span>Results</span>
                  {isChecking && (
                    <Icons.Loader className="ml-2 h-4 w-4 text-blue-500 dark:text-blue-400 animate-spin" />
                  )}
                </h2>

                <div className="flex items-center space-x-2">
                  {results.length > 5 && (
                    <div className="relative">
                      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                        <Icons.Search className="h-3 w-3 text-gray-500 dark:text-gray-400 mr-1" />
                        <input
                          type="text"
                          placeholder="Search..."
                          className="text-xs w-24 sm:w-32 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 dark:text-gray-300"
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={downloadResults}
                    className="text-xs bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors flex items-center"
                    disabled={isChecking}
                  >
                    <Icons.Save className="h-3 w-3 mr-1" />
                    Export
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Checked {results.length} addresses
                  </span>
                </div>
              </div>
              {/* Results List with Premium addresses having distinct styling and badge indications */}
              <div className="space-y-2 max-h-[calc(min(40vh,32rem))] overflow-y-auto pr-1 -mr-1 rounded-lg scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {filteredResults.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    {searchQuery
                      ? "No results match your search"
                      : "No results available"}
                  </div>
                ) : (
                  filteredResults.map((result, index) => (
                    <div
                      key={index}
                      className={`relative flex flex-col gap-2 p-2.5 sm:p-3 border rounded-xl hover:shadow-md transition-all ${
                        result.status === "success"
                          ? result.premium
                            ? "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800"
                            : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : result.status === "notfound"
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      }`}
                    >
                      {/* Add premium badge indicator */}
                      {result.status === "success" && result.premium && (
                        <div className="absolute -top-2 -right-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-lg border-2 border-white dark:border-gray-800">
                            <Icons.Award className="h-3.5 w-3.5 text-white" />
                          </span>
                        </div>
                      )}

                      {/* First row with address and status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-2xs xs:text-xs shadow-sm border-gray-200 dark:border-gray-700 border truncate max-w-[150px] text-gray-800 dark:text-gray-200">
                            {result.address.slice(0, 6)}...
                            {result.address.slice(-6)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {result.premium && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-300 text-2xs rounded-full border border-amber-200 dark:border-amber-800/50 shadow-sm">
                              <Icons.Star className="h-2.5 w-2.5" />
                              Premium
                            </span>
                          )}
                          <div className="flex space-x-1">
                            <button
                              onClick={() => copyToClipboard(result.address)}
                              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              title="Copy address"
                              aria-label="Copy address to clipboard"
                            >
                              {copiedAddress === result.address ? (
                                <span className="text-2xs text-green-600 dark:text-green-400">
                                  Copied!
                                </span>
                              ) : (
                                <Icons.Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 dark:text-gray-400" />
                              )}
                            </button>
                            <button
                              onClick={() => openExplorer(result.address)}
                              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              title="View on explorer"
                              aria-label="View address on block explorer"
                            >
                              <Icons.ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500 dark:text-blue-400" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Second row with transaction details */}
                      {result.status === "success" && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-100 dark:border-gray-700">
                          {/* Transaction information */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                              Transactions:
                            </span>
                            <div className="flex items-center">
                              <span className="font-mono font-bold text-sm text-yellow-600 dark:text-yellow-400">
                                {result.transactions}
                              </span>
                              <span className="ml-1.5 text-green-500 text-2xs">
                                (≥ 45) ✅
                              </span>
                            </div>
                          </div>

                          {/* Transaction progress bar */}
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-yellow-500 dark:bg-yellow-600"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (result.transactions || 45) / 2.5
                                )}%`,
                              }}
                            ></div>
                          </div>

                          {/* Badge Status Section */}
                          <div className="mt-2 bg-blue-50 dark:bg-blue-900/30 rounded-md p-2 text-2xs">
                            <BadgeStatus result={result} Icons={Icons} />
                          </div>

                          {/* Transaction types detailed breakdown */}
                          <div className="mt-2 bg-gray-50 dark:bg-gray-900/30 rounded-md p-2 text-2xs">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Transaction Types:
                              </span>
                              <span className="text-blue-600 dark:text-blue-400">
                                {result.transactions} Total
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600 dark:text-gray-400">
                              <div className="flex justify-between">
                                <span>Execute:</span>
                                <span className="font-mono">
                                  {result.txStats?.execute || "-"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Withdraw:</span>
                                <span className="font-mono">
                                  {result.txStats?.withdraw || "-"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Mint:</span>
                                <span className="font-mono">
                                  {result.txStats?.mint || "-"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>GetReward:</span>
                                <span className="font-mono">
                                  {result.txStats?.getReward || "-"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Multicall:</span>
                                <span className="font-mono">
                                  {result.txStats?.multicall || "-"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Other:</span>
                                <span className="font-mono">
                                  {result.txStats?.other || "-"}
                                </span>
                              </div>
                              <div className="flex justify-between col-span-2 mt-1 pt-1 border-t border-gray-200 dark:border-gray-700 text-red-500 dark:text-red-400">
                                <span>Failed (not counted):</span>
                                <span className="font-mono">
                                  {result.txStats?.failed || "0"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Supporter level */}
                          <div className="flex justify-between items-center mt-1">
                            {result.premium ? (
                              <span className="text-2xs font-medium px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                Premium Badge Eligible
                              </span>
                            ) : (
                              <span className="text-2xs font-medium px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                                OG Badge Eligible
                              </span>
                            )}
                            <span className="text-2xs text-gray-500 dark:text-gray-400">
                              {formatDate(result.timestamp)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Display message for non-successful results */}
                      {result.status !== "success" && (
                        <div className="flex justify-between items-center">
                          <span
                            className={`${
                              result.status === "notfound"
                                ? "text-red-600 dark:text-red-400"
                                : "text-yellow-600 dark:text-yellow-400"
                            } text-2xs xs:text-xs sm:text-sm font-medium`}
                          >
                            {result.message}
                          </span>
                          <span className="text-2xs text-gray-500 dark:text-gray-400">
                            {formatDate(result.timestamp)}
                          </span>
                        </div>
                      )}

                      {/* Premium reason if applicable */}
                      {result.premium && result.premiumReason && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-1.5 text-2xs text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                          <div className="flex items-center">
                            <Icons.Award className="h-3 w-3 mr-1 text-amber-500" />
                            <span>{result.premiumReason}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              {/* Summary Dashboard */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-md">
                <div className="font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200 text-sm sm:text-base flex items-center">
                  <span className="mr-2">Summary Dashboard</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-xl border border-green-200 dark:border-green-800/50 shadow-sm">
                    <div className="text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm flex items-center">
                      <Icons.CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Eligible
                    </div>
                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-green-700 dark:text-green-500 mt-1">
                      {summaryStats.eligible}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {summaryStats.eligiblePercent}% of total
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-sm">
                    <div className="text-amber-600 dark:text-amber-400 font-medium text-xs sm:text-sm flex items-center">
                      <Icons.Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Premium OG
                    </div>
                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-amber-700 dark:text-amber-500 mt-1">
                      {summaryStats.premium}
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {summaryStats.premiumPercent}% of eligible
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 rounded-xl border border-red-200 dark:border-red-800/50 shadow-sm">
                    <div className="text-red-600 dark:text-red-400 font-medium text-xs sm:text-sm flex items-center">
                      <Icons.XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Not Eligible
                    </div>
                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-red-700 dark:text-red-500 mt-1">
                      {summaryStats.notEligible}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {summaryStats.notEligiblePercent}% of total
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
                    <div className="text-yellow-600 dark:text-yellow-400 font-medium text-xs sm:text-sm flex items-center">
                      <Icons.AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Errors
                    </div>
                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-700 dark:text-yellow-500 mt-1">
                      {summaryStats.errors}
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      {summaryStats.errorsPercent}% of total
                    </div>
                  </div>
                </div>

                {/* Badge Distribution Statistics - New Addition */}
                <div className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Badge Distribution Status
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* OG Badge Distribution */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2 border border-blue-100 dark:border-blue-800/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <Icons.Shield className="h-3.5 w-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                            OG Badge Recipients
                          </span>
                        </div>
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                          {summaryStats.hasOgBadge} / {summaryStats.eligible}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-blue-100 dark:bg-blue-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${summaryStats.ogBadgePercent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-end mt-1">
                        <span className="text-2xs text-blue-600 dark:text-blue-400">
                          {summaryStats.ogBadgePercent}% received
                        </span>
                      </div>
                    </div>

                    {/* Premium Badge Distribution */}
                    <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-2 border border-amber-100 dark:border-amber-800/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <Icons.Award className="h-3.5 w-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                            Premium OG Badge Recipients
                          </span>
                        </div>
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                          {summaryStats.hasPremiumBadge} /{" "}
                          {summaryStats.premium > 0
                            ? summaryStats.premium
                            : "0"}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-amber-100 dark:bg-amber-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 dark:bg-amber-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              summaryStats.premium > 0
                                ? summaryStats.premiumBadgePercent
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-end mt-1">
                        <span className="text-2xs text-amber-600 dark:text-amber-400">
                          {summaryStats.premium > 0
                            ? summaryStats.premiumBadgePercent
                            : 0}
                          % received
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Update this section in Badge Distribution Status */}
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <p className="flex items-center">
                      <Icons.Clock className="h-3 w-3 mr-1" />
                      Last updated:{" "}
                      {new Date("2025-03-04T23:26:36Z").toLocaleDateString()}
                    </p>
                    <button
                      onClick={openBadgeInventory}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <Icons.ExternalLink className="h-3 w-3 mr-1" />
                      View on Blockscout
                    </button>
                  </div>
                </div>

                {/* Visual Representation - Fixed height to prevent layout shifts */}
                <div className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-700">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                          OG Badge
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                          {summaryStats.eligible} of {results.length} eligible
                        </span>
                      </div>
                    </div>
                    <div className="flex h-4 mb-2 overflow-hidden text-xs rounded-full">
                      <div
                        style={{
                          width: `${summaryStats.eligiblePercent}%`,
                        }}
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 dark:bg-green-600 transition-all duration-500"
                      ></div>
                      <div
                        style={{
                          width: `${summaryStats.notEligiblePercent}%`,
                        }}
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 dark:bg-red-600 transition-all duration-500"
                      ></div>
                      <div
                        style={{
                          width: `${summaryStats.errorsPercent}%`,
                        }}
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 dark:bg-yellow-600 transition-all duration-500"
                      ></div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mt-2">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-green-500 dark:bg-green-600 rounded mr-1"></div>
                        <span>Eligible</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-red-500 dark:bg-red-600 rounded mr-1"></div>
                        <span>Not eligible</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-yellow-500 dark:bg-yellow-600 rounded mr-1"></div>
                        <span>Errors</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Badge Distribution (only if there are eligible addresses) */}
                {summaryStats.eligible > 0 && (
                  <div className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-700">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-amber-600 dark:text-amber-400">
                            Premium OG Badge
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-amber-600 dark:text-amber-400">
                            {summaryStats.premium} of {summaryStats.eligible}{" "}
                            eligible addresses
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex h-4 mb-2 overflow-hidden text-xs rounded-full">
                      <div
                        style={{
                          width: `${summaryStats.premiumPercent || 0}%`,
                        }}
                        className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500 dark:bg-amber-600 transition-all duration-500"
                      ></div>
                      <div
                        style={{
                          width: `${100 - (summaryStats.premiumPercent || 0)}%`,
                        }}
                        className="flex flex-col text-center whitespace-nowrap text-gray-600 justify-center bg-gray-200 dark:bg-gray-600 transition-all duration-500"
                      ></div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mt-2">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-amber-500 dark:bg-amber-600 rounded mr-1"></div>
                        <span>
                          Premium OG Badge (
                          {summaryStats.premium > 0
                            ? summaryStats.hasPremiumBadge
                            : 0}{" "}
                          received)
                        </span>
                      </div>
                      <div className="flex items-center">
                        {/* <div className="h-3 w-3 bg-gray-200 dark:bg-gray-600 rounded mr-1"></div>
                        <span>Regular OG Badge</span> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Add Footer component here, before the closing div */}
          <FAQ />
          <Footer />{" "}
        </div>
      </main>
    </>
  );
}
