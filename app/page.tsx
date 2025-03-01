"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

// Static imports instead of dynamic for better mobile compatibility
const Icons = {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Info,
  Loader,
  ChevronDown,
};

interface ResultItem {
  address: string;
  status: "success" | "error" | "notfound";
  message: string;
  transactions?: number;
  timestamp?: string;
}

export default function Home() {
  // Initialize isMobile with a default value to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState(false);
  const [addresses, setAddresses] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProcessing, setCurrentProcessing] = useState<string>("");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Detect mobile device - improved to run only on client
  useEffect(() => {
    // Only run on client-side
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

  // Scroll to results when they appear
  useEffect(() => {
    if (results.length > 0 && !isChecking && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results, isChecking]);

  // In the checkWallet function, replace the simulation with:
  const checkWallet = async (address: string): Promise<ResultItem> => {
    try {
      const response = await fetch(`/api/check?address=${address}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const timestamp = new Date().toISOString();

      return {
        address,
        status: data.found ? "success" : "notfound",
        message: data.found ? `Found (${data.transactions} tx)` : "Not found",
        transactions: data.transactions || 0,
        timestamp,
      };
    } catch (error) {
      console.error("Error checking address:", error);
      return {
        address,
        status: "error",
        message: "Error checking address",
        timestamp: new Date().toISOString(),
      };
    }
  };

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

    setIsChecking(true);
    setResults([]);
    setProgress(0);
    setError(null);

    try {
      for (let i = 0; i < addressList.length; i++) {
        const address = addressList[i];
        setCurrentProcessing(address);
        setProgress(Math.floor((i / addressList.length) * 100));

        const result = await checkWallet(address);

        setResults((prevResults) => {
          const newResults = [...prevResults];
          newResults.push(result);
          return newResults;
        });
      }
    } catch (err) {
      setError("An error occurred while checking addresses");
    } finally {
      setProgress(100);
      setCurrentProcessing("");
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Icons.CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0" />
        );
      case "notfound":
        return (
          <Icons.XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0" />
        );
      case "error":
        return (
          <Icons.AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 shrink-0" />
        );
      default:
        return null;
    }
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const openExplorer = (address: string) => {
    window.open(`https://explorer.soneium.com/address/${address}`, "_blank");
  };

  const downloadResults = () => {
    if (!results.length) return;

    const csvContent = [
      "Address,Status,Transactions,Timestamp",
      ...results.map(
        (r) =>
          `${r.address},${r.status},${r.transactions || 0},${r.timestamp || ""}`
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

  const countEligibleAddresses = () => {
    return results.filter((r) => r.status === "success").length;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-2 py-3 sm:p-4 md:p-8 max-w-4xl mx-auto">
      <div className="space-y-3 sm:space-y-4 bg-white p-3 sm:p-6 rounded-2xl shadow-lg border border-blue-100">
        {/* Header Section */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="bg-blue-600 p-1 sm:p-2 rounded-xl shadow-md transform -rotate-6">
                <Image
                  src="/assets/icon.png"
                  alt="Soneium Logo"
                  width={28}
                  height={28}
                  className="sm:w-[36px] sm:h-[36px]"
                />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <h1 className="ml-2 text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Soneium OG Badge Checker
            </h1>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-xl border border-blue-100">
            <p className="text-sm sm:text-base text-gray-700 font-medium">
              Check wallet eligibility for Soneium OG Badge
            </p>
            <div className="flex items-center justify-center mt-1 space-x-1">
              <p className="text-xs text-gray-500">
                Snapshot taken at block{" "}
                <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">
                  #3747022
                </span>
              </p>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-blue-500 hover:text-blue-700"
                aria-label="Show information"
              >
                <Icons.Info className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        {showInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-blue-800 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
              aria-label="Close information"
            >
              <Icons.XCircle className="h-4 w-4" />
            </button>
            <h3 className="font-semibold mb-2">About Soneium OG Badge</h3>
            <p className="mb-2">
              The Soneium OG Badge is a special recognition for early supporters
              and contributors to the Soneium ecosystem. Eligible wallets must
              have conducted transactions on the Soneium network before block
              #3747022.
            </p>
            <div className="mt-3 text-xs bg-white p-2 rounded-lg border border-blue-200">
              <p className="font-medium">Benefits include:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Early access to new features</li>
                <li>Exclusive airdrops</li>
                <li>Special governance rights</li>
                <li>Community recognition</li>
              </ul>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm flex items-start">
            <Icons.AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Section */}
        <div className="space-y-2 sm:space-y-3">
          <div className="relative">
            <textarea
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
              placeholder="Enter wallet addresses (one per line)&#10;Example: 0x1234...5678"
              className="w-full h-24 sm:h-36 p-3 sm:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-xs sm:text-sm shadow-sm"
              disabled={isChecking}
              style={{ fontSize: isMobile ? "12px" : "" }}
            />
            {addresses && (
              <div className="absolute right-3 bottom-2 text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm border">
                {addresses.split("\n").filter((line) => line.trim()).length}{" "}
                addresses
              </div>
            )}
          </div>

          <button
            onClick={handleCheck}
            disabled={isChecking || !addresses.trim()}
            className="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl disabled:opacity-50 hover:from-blue-600 hover:to-indigo-700 transition-all font-medium text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
          >
            {isChecking ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                <span>
                  Checking{" "}
                  {currentProcessing && (
                    <span className="font-mono">
                      {currentProcessing.slice(0, 6)}...
                      {currentProcessing.slice(-4)}
                    </span>
                  )}
                </span>
              </>
            ) : (
              <span>Check Eligibility</span>
            )}
          </button>
        </div>

        {/* Progress Bar (visible when checking) */}
        {isChecking && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
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
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-800 flex items-center">
                <span>Results</span>
                {isChecking && (
                  <Icons.Loader className="ml-2 h-4 w-4 text-blue-500 animate-spin" />
                )}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={downloadResults}
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded-lg border border-blue-200 transition-colors flex items-center"
                  disabled={isChecking}
                >
                  <Icons.Copy className="h-3 w-3 mr-1" />
                  Export
                </button>
                <span className="text-xs text-gray-500">
                  Checked {results.length} addresses
                </span>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-2 max-h-48 sm:max-h-64 md:max-h-96 overflow-y-auto pr-1 -mr-1 rounded-lg">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center flex-wrap xs:flex-nowrap gap-2 p-2.5 sm:p-3 border rounded-xl hover:shadow-md transition-all ${
                    result.status === "success"
                      ? "bg-green-50 border-green-200"
                      : result.status === "notfound"
                      ? "bg-red-50 border-red-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  {getStatusIcon(result.status)}
                  <span className="font-mono bg-white px-2 py-1 rounded-lg text-2xs xs:text-xs shadow-sm border-gray-200 border truncate max-w-[120px] sm:max-w-none">
                    {result.address.slice(0, 6)}...{result.address.slice(-6)}
                  </span>
                  <span
                    className={`${
                      result.status === "success"
                        ? "text-green-600"
                        : result.status === "notfound"
                        ? "text-red-600"
                        : "text-yellow-600"
                    } ml-auto text-2xs xs:text-xs sm:text-sm font-medium whitespace-nowrap`}
                  >
                    {result.message}
                  </span>

                  {/* Timestamp */}
                  <span className="text-2xs text-gray-500 hidden xs:inline ml-1">
                    {formatDate(result.timestamp)}
                  </span>

                  {/* Action buttons */}
                  <div className="flex space-x-1 ml-1">
                    <button
                      onClick={() => copyToClipboard(result.address)}
                      className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                      title="Copy address"
                    >
                      {copiedAddress === result.address ? (
                        <span className="text-2xs xs:text-xs text-green-600">
                          Copied!
                        </span>
                      ) : (
                        <Icons.Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={() => openExplorer(result.address)}
                      className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                      title="View on explorer"
                    >
                      <Icons.ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Dashboard */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-100 shadow-md">
              <div className="font-semibold mb-3 sm:mb-4 text-gray-800 text-sm sm:text-base flex items-center">
                <span className="mr-2">Summary Dashboard</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                  <div className="text-green-600 font-medium text-xs sm:text-sm flex items-center">
                    <Icons.CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Eligible
                  </div>
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-green-700 mt-1">
                    {results.filter((r) => r.status === "success").length}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {Math.round(
                      (results.filter((r) => r.status === "success").length /
                        results.length) *
                        100
                    )}
                    % of total
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 shadow-sm">
                  <div className="text-red-600 font-medium text-xs sm:text-sm flex items-center">
                    <Icons.XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Not Eligible
                  </div>
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-red-700 mt-1">
                    {results.filter((r) => r.status === "notfound").length}
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    {Math.round(
                      (results.filter((r) => r.status === "notfound").length /
                        results.length) *
                        100
                    )}
                    % of total
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm">
                  <div className="text-yellow-600 font-medium text-xs sm:text-sm flex items-center">
                    <Icons.AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Errors
                  </div>
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-700 mt-1">
                    {results.filter((r) => r.status === "error").length}
                  </div>
                  <div className="text-xs text-yellow-600 mt-1">
                    {Math.round(
                      (results.filter((r) => r.status === "error").length /
                        results.length) *
                        100
                    )}
                    % of total
                  </div>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="mt-4 bg-white p-3 rounded-lg border border-blue-100">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        Distribution
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {countEligibleAddresses()} of {results.length} eligible
                      </span>
                    </div>
                  </div>
                  <div className="flex h-4 mb-2 overflow-hidden text-xs rounded-full">
                    <div
                      style={{
                        width: `${
                          (results.filter((r) => r.status === "success")
                            .length /
                            results.length) *
                          100
                        }%`,
                      }}
                      className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                    ></div>
                    <div
                      style={{
                        width: `${
                          (results.filter((r) => r.status === "notfound")
                            .length /
                            results.length) *
                          100
                        }%`,
                      }}
                      className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 transition-all duration-500"
                    ></div>
                    <div
                      style={{
                        width: `${
                          (results.filter((r) => r.status === "error").length /
                            results.length) *
                          100
                        }%`,
                      }}
                      className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section (Collapsible) */}
        <div className="border-t pt-3 mt-2">
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer text-sm text-gray-600">
              <span>Frequently Asked Questions</span>
              <span className="transition group-open:rotate-180">
                <Icons.ChevronDown className="h-4 w-4" />
              </span>
            </summary>
            <div className="text-xs sm:text-sm text-gray-600 mt-3 space-y-2 bg-gray-50 p-3 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-700">
                  What is the Soneium OG Badge?
                </h3>
                <p className="mt-1">
                  A special recognition for the earliest supporters and active
                  participants in the Soneium ecosystem.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  How do I qualify?
                </h3>
                <p className="mt-1">
                  You need to have had transactions on the Soneium network
                  before block #3747022.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  Can I check multiple wallets?
                </h3>
                <p className="mt-1">
                  Yes, enter multiple addresses (one per line) to check in batch
                  mode.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  When will badges be distributed?
                </h3>
                <p className="mt-1">
                  OG Badge distribution will begin March 15, 2025. Eligible
                  wallets will receive an NFT badge directly to their wallet.
                </p>
              </div>
            </div>
          </details>
        </div>

        {/* Premium Footer */}
        <div className="text-center pt-3 border-t space-y-2">
          <div className="text-xs sm:text-sm text-gray-600">
            Soneium OG Badge - Recognizing our earliest supporters 🏆
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 mt-1">
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 px-2 py-1 rounded-full"
            >
              #SoneiumOG
            </a>
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 px-2 py-1 rounded-full"
            >
              #SONEEcosystem
            </a>
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 px-2 py-1 rounded-full"
            >
              #Web3
            </a>
          </div>
          <div className="text-xs text-gray-400 pt-1">
            © 2025 Soneium Labs ·{" "}
            <a href="#" className="hover:text-blue-500">
              Terms
            </a>{" "}
            ·{" "}
            <a href="#" className="hover:text-blue-500">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
