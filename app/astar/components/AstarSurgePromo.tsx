"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Award,
  Shield,
  Star,
  Wallet,
  Lock,
  ArrowRight,
  Unlock,
  Calendar,
  Gift,
} from "lucide-react";

// Project logos - you'll need to add these to your public assets
const projectLogos = {
  sake: "/assets/astar/sake-logo.png",
  yay: "/assets/astar/yay-logo.png",
  untitledBank: "/assets/astar/untitled-bank-logo.png",
  sonex: "/assets/astar/sonex-logo.png",
  kyo: "/assets/astar/kyo-logo.png",
  astar: "/assets/astar/astar-logo.png",
};

// Interface for participation data
interface ProjectParticipation {
  projectId: string;
  projectName: string;
  depositedAmount: string; // in ASTR/WASTR
  pointsEarned: number;
  depositDate: string;
  withdrawalEligible: boolean;
  agentId?: string; // The Agent NFT ID if applicable
  claimableTokens?: {
    amount: string;
    symbol: string;
    available: boolean;
    claimDate?: string;
  };
}

interface ParticipationData {
  address: string;
  isParticipating: boolean;
  totalDeposited: string; // Total ASTR/WASTR deposited
  totalPoints: number;
  projects: ProjectParticipation[];
  timelockExpiry: string; // Date when timelock expires
  migrationStatus?: string; // Status of migration to Soneium
}

export default function AstarSurgePromo() {
  // State management
  const [walletAddress, setWalletAddress] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [participationData, setParticipationData] =
    useState<ParticipationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [timelockExpired, setTimelockExpired] = useState(false);

  // Dark mode initialization effect
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check localStorage for dark mode setting
      const savedDarkMode = localStorage.getItem("soneium-darkMode");

      if (savedDarkMode) {
        // Apply dark mode based on saved preference
        if (savedDarkMode === "true") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // If no saved preference, check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  }, []);

  // Validate Ethereum/Astar address
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Check if timelock has expired based on current date
  useEffect(() => {
    const currentDate = new Date(); // Current date
    const expiryDate = new Date("2025-02-01T00:00:00Z"); // Timelock expiry date
    setTimelockExpired(currentDate > expiryDate);
  }, []);

  // Mock function to check participation - replace with actual API call
  const checkParticipation = async (address: string) => {
    if (!isValidAddress(address)) {
      throw new Error("Invalid wallet address format");
    }

    setIsChecking(true);
    setError(null);

    try {
      // This would be replaced with your actual API call
      // For now, we'll simulate an API response with mock data
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      // Current date is March 6, 2025 - after the timelock expiry
      const currentDate = new Date("2025-03-06T00:24:57Z");

      // Mock data - in real implementation, fetch from API
      const mockData: ParticipationData = {
        address: address,
        isParticipating:
          address.toLowerCase().endsWith("a") ||
          address.toLowerCase().endsWith("1"), // Random condition for demo
        totalDeposited: address.toLowerCase().endsWith("a") ? "250.5" : "0",
        totalPoints: address.toLowerCase().endsWith("a") ? 1250 : 0,
        timelockExpiry: "2025-02-01T00:00:00Z",
        migrationStatus: address.toLowerCase().endsWith("a")
          ? "Partially Migrated"
          : "Not Started",
        projects: [
          {
            projectId: "sake",
            projectName: "Sake Finance",
            depositedAmount: address.toLowerCase().endsWith("a")
              ? "100.0"
              : "0",
            pointsEarned: address.toLowerCase().endsWith("a") ? 500 : 0,
            depositDate: address.toLowerCase().endsWith("a")
              ? "2024-12-20T14:32:45Z"
              : "",
            withdrawalEligible: true, // Timelock has expired as of March 6, 2025
            agentId: address.toLowerCase().endsWith("a") ? "43278" : undefined,
            claimableTokens: {
              amount: address.toLowerCase().endsWith("a") ? "2500" : "0",
              symbol: "SAKE",
              available: true,
              claimDate: "2025-02-15T00:00:00Z",
            },
          },
          {
            projectId: "yay",
            projectName: "Yay!",
            depositedAmount: address.toLowerCase().endsWith("a") ? "50.5" : "0",
            pointsEarned: address.toLowerCase().endsWith("a") ? 250 : 0,
            depositDate: address.toLowerCase().endsWith("a")
              ? "2024-12-21T09:15:22Z"
              : "",
            withdrawalEligible: true,
            agentId: address.toLowerCase().endsWith("a") ? "15689" : undefined,
            claimableTokens: {
              amount: address.toLowerCase().endsWith("a") ? "1250" : "0",
              symbol: "YAY",
              available: false,
              claimDate: "2025-03-15T00:00:00Z", // Future date
            },
          },
          {
            projectId: "untitledBank",
            projectName: "Untitled Bank",
            depositedAmount: address.toLowerCase().endsWith("a")
              ? "100.0"
              : "0",
            pointsEarned: address.toLowerCase().endsWith("a") ? 500 : 0,
            depositDate: address.toLowerCase().endsWith("a")
              ? "2024-12-19T16:45:12Z"
              : "",
            withdrawalEligible: true,
            agentId: address.toLowerCase().endsWith("a") ? "28901" : undefined,
            claimableTokens: {
              amount: address.toLowerCase().endsWith("a") ? "750" : "0",
              symbol: "UB",
              available: true,
              claimDate: "2025-02-28T00:00:00Z",
            },
          },
          {
            projectId: "sonex",
            projectName: "SoneX",
            depositedAmount: "0",
            pointsEarned: 0,
            depositDate: "",
            withdrawalEligible: false,
          },
          {
            projectId: "kyo",
            projectName: "Kyo Finance",
            depositedAmount: "0",
            pointsEarned: 0,
            depositDate: "",
            withdrawalEligible: false,
          },
        ],
      };

      setParticipationData(mockData);
      return mockData;
    } catch (err: any) {
      console.error("Error checking participation:", err);
      setError(
        err.message || "An error occurred while checking your participation"
      );
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheck = async () => {
    if (!walletAddress.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    await checkParticipation(walletAddress.trim());
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const openExplorer = (address: string) => {
    window.open(
      `https://blockscout.astar.network/address/${address}`,
      "_blank"
    );
  };

  const getImageSrc = (projectId: string, projectName?: string) => {
    const path = projectLogos[projectId as keyof typeof projectLogos];
    try {
      return (
        path ||
        `https://placehold.co/200x200/6d28d9/ffffff?text=${
          projectName ? projectName.substring(0, 1).toUpperCase() : "?"
        }`
      );
    } catch (e) {
      return "https://placehold.co/200x200/6d28d9/ffffff?text=?";
    }
  };

  // Calculate days remaining until timelock expiry or days since expiry
  const calculateDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} days remaining`;
    } else if (diffDays === 0) {
      return "Expires today";
    } else {
      return `Expired ${Math.abs(diffDays)} days ago`;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 px-2 py-3 sm:p-4 md:p-8">
      <div className="space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {/* In AstarSurgePromo.tsx */}
              <div className="relative">
                <div className="bg-purple-600 dark:bg-purple-500 p-1 sm:p-2 rounded-xl shadow-md transform -rotate-6">
                  <Image
                    src="/assets/astar/astar-logo.png"
                    alt="Astar Logo"
                    width={28}
                    height={28}
                    className="sm:w-[36px] sm:h-[36px]"
                  />
                </div>
                <div className="absolute -top-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
              </div>
              <h1 className="ml-2 text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Astar Surge Status
              </h1>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                timelockExpired
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              }`}
            >
              {timelockExpired ? "Timelock Expired" : "Timelock Active"}
            </span>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-3 sm:p-4 rounded-xl border border-purple-100 dark:border-gray-600">
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                  Pre-Deposit Campaign
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 dark:text-amber-400" />
                <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                  Earn Project Points
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center mt-2 space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Campaign timelock expired on{" "}
                  <span className="font-mono bg-purple-100 dark:bg-purple-900 px-1.5 py-0.5 rounded text-purple-800 dark:text-purple-300">
                    Feb 1, 2025
                  </span>
                </p>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                  aria-label="Show information"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-2 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg p-2 text-xs text-purple-800 dark:text-purple-300 flex items-center justify-center text-center">
              <Star className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                Check your deposit status and token claims from the Astar Surge
                campaign
              </span>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        {showInfo && (
          <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-purple-800 dark:text-purple-300 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-2 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              aria-label="Close information"
            >
              <XCircle className="h-4 w-4" />
            </button>

            <h3 className="font-semibold mb-2">About Astar Surge Campaign</h3>
            <p className="mb-3">
              Astar Surge is a pre-deposit campaign hosted by top-tier Soneium
              projects, allowing ASTR holders to deposit tokens into dedicated
              contracts on Astar Network. Participants earn points that are
              redeemable for tokens during the respective projects' Token
              Generation Events (TGEs).
            </p>

            <h4 className="font-medium mt-3 mb-1">Participating Projects:</h4>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                Sake Finance: DeFi platform offering asset swaps and yield
                farming
              </li>
              <li>
                Yay!: Social Web3 platform combining community features with
                DeFi
              </li>
              <li>
                Untitled Bank: Financial services including lending and
                borrowing
              </li>
              <li>SoneX: Token swap platform focused on speed and security</li>
              <li>
                Kyo Finance: Advanced DeFi tools including leveraged yield
                farming
              </li>
            </ul>

            <h4 className="font-medium mt-3 mb-1">How It Works:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>
                Create an Agent through the Agent Factory and deposit ASTR or
                vASTR
              </li>
              <li>
                ASTR deposits are automatically wrapped into WASTR for
                compatibility
              </li>
              <li>Earn points based on your deposits and participation</li>
              <li>
                After Soneium mainnet launches, bridge assets or withdraw after
                Feb 1, 2025
              </li>
              <li>
                Redeem points for project tokens during each project's TGE
              </li>
            </ol>

            <div className="mt-3 flex items-center">
              <Clock className="h-4 w-4 mr-1.5" />
              <span className="text-xs font-semibold">
                Campaign Timelock Expired: February 1, 2025
              </span>
            </div>

            <div className="mt-2 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-800 dark:text-amber-300 text-xs">
              <div className="flex items-center">
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                <span>
                  Current Status: Timelock expired. Deposits can now be
                  withdrawn from Astar Network.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Section */}
        <div className="space-y-2 sm:space-y-3">
          <div className="relative">
            <input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your Astar wallet address (0x...)"
              className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-purple-500 dark:focus:border-purple-600 outline-none font-mono text-xs sm:text-sm shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              disabled={isChecking}
            />
          </div>

          <button
            onClick={handleCheck}
            disabled={isChecking || !walletAddress.trim()}
            className="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 text-white rounded-xl disabled:opacity-50 hover:from-purple-600 hover:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-800 transition-all font-medium text-sm sm:text-base shadow-md hover:shadow-lg flex items-center justify-center"
          >
            {isChecking ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                <span>Checking Status...</span>
              </>
            ) : (
              <span>Check Astar Surge Status</span>
            )}
          </button>
        </div>

        {/* Results Section */}
        {participationData && (
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <span>Participation Status</span>
                {isChecking && (
                  <Loader className="ml-2 h-4 w-4 text-purple-500 dark:text-purple-400 animate-spin" />
                )}
              </h2>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => copyToClipboard(participationData.address)}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Copy address"
                  >
                    {copiedAddress === participationData.address ? (
                      <span className="text-2xs text-green-600 dark:text-green-400">
                        Copied!
                      </span>
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => openExplorer(participationData.address)}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="View on explorer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Overview Card */}
            <div
              className={`p-4 rounded-xl border shadow-sm ${
                participationData.isParticipating
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-center mb-3">
                {participationData.isParticipating ? (
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                )}
                <h3
                  className={`font-medium text-base ${
                    participationData.isParticipating
                      ? "text-green-800 dark:text-green-300"
                      : "text-red-800 dark:text-red-300"
                  }`}
                >
                  {participationData.isParticipating
                    ? "You participated in Astar Surge"
                    : "You did not participate in Astar Surge"}
                </h3>
              </div>

              {participationData.isParticipating ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-green-100 dark:border-green-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Deposited
                    </p>
                    <p className="font-mono font-semibold text-lg text-gray-800 dark:text-gray-200">
                      {participationData.totalDeposited}{" "}
                      <span className="text-xs text-gray-500">ASTR</span>
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-green-100 dark:border-green-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Points Earned
                    </p>
                    <p className="font-mono font-semibold text-lg text-indigo-600 dark:text-indigo-400">
                      {participationData.totalPoints.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-green-100 dark:border-green-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Timelock Status
                    </p>
                    <div className="flex items-center">
                      {timelockExpired ? (
                        <Unlock className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1" />
                      ) : (
                        <Lock className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1" />
                      )}
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {timelockExpired ? "Unlocked" : "Locked"}
                      </p>
                    </div>
                    <p className="text-2xs text-amber-600 dark:text-amber-400 mt-1">
                      {calculateDaysRemaining(participationData.timelockExpiry)}
                    </p>
                  </div>

                  {/* Migration Status Box - Added Since Timelock Expired */}
                  <div className="sm:col-span-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800/50 mt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-1.5" />
                        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                          Soneium Migration Status
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-800/60 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        {participationData.migrationStatus || "Not Started"}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-indigo-600 dark:text-indigo-400">
                      {participationData.migrationStatus === "Completed"
                        ? "All assets successfully migrated to Soneium Network"
                        : participationData.migrationStatus ===
                          "Partially Migrated"
                        ? "Some assets have been migrated to Soneium. Complete migration or withdraw remaining assets."
                        : "Assets can now be withdrawn from Astar Network or migrated to Soneium."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You didn't participate in the Astar Surge campaign. The
                    campaign ran from December 18, 2024 to February 1, 2025.
                  </p>
                  <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
                    Stay tuned for future campaigns and opportunities in the
                    Astar ecosystem!
                  </p>
                </div>
              )}
            </div>

            {/* Project Details */}
            {participationData.isParticipating && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Project Participation Details
                </h3>
                <div className="space-y-2">
                  {participationData.projects.map((project) => (
                    <div
                      key={project.projectId}
                      className={`border rounded-lg overflow-hidden ${
                        project.depositedAmount === "0"
                          ? "border-gray-200 dark:border-gray-700"
                          : "border-purple-200 dark:border-purple-700"
                      }`}
                    >
                      <div
                        className={`p-3 flex items-center justify-between cursor-pointer ${
                          project.depositedAmount === "0"
                            ? "bg-gray-50 dark:bg-gray-800"
                            : "bg-purple-50 dark:bg-purple-900/20"
                        }`}
                        onClick={() =>
                          setSelectedProject(
                            selectedProject === project.projectId
                              ? null
                              : project.projectId
                          )
                        }
                      >
                        <div className="flex items-center">
                          {project.depositedAmount !== "0" ? (
                            <div className="h-8 w-8 rounded-full bg-white dark:bg-gray-700 p-1.5 mr-3 border border-purple-100 dark:border-purple-800">
                              <Image
                                src={getImageSrc(project.projectId)}
                                alt={project.projectName}
                                width={24}
                                height={24}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 p-1.5 mr-3 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                              <Wallet className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                              {project.projectName}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {project.depositedAmount !== "0"
                                ? `${project.depositedAmount} ASTR deposited`
                                : "No deposits yet"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {project.depositedAmount !== "0" && (
                            <div className="mr-4">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Points
                              </span>
                              <p className="font-mono font-medium text-sm text-indigo-600 dark:text-indigo-400">
                                {project.pointsEarned.toLocaleString()}
                              </p>
                            </div>
                          )}
                          <ChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform ${
                              selectedProject === project.projectId
                                ? "transform rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      </div>

                      {selectedProject === project.projectId && (
                        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                          {project.depositedAmount !== "0" ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">
                                    Agent ID
                                  </p>
                                  <p className="font-mono font-medium text-gray-800 dark:text-gray-200">
                                    {project.agentId || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">
                                    Deposit Date
                                  </p>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {formatDate(project.depositDate)}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Withdrawal Status
                                </p>
                                <div
                                  className={`flex items-center px-3 py-2 rounded-lg ${
                                    project.withdrawalEligible
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                  }`}
                                >
                                  {project.withdrawalEligible ? (
                                    <>
                                      <Unlock className="h-4 w-4 mr-1.5" />
                                      <span>
                                        Withdrawal eligible (timelock expired)
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="h-4 w-4 mr-1.5" />
                                      <span>
                                        Locked until{" "}
                                        {formatDate(
                                          participationData.timelockExpiry
                                        )}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Token Claims Section */}
                              {project.claimableTokens && (
                                <div className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Token Claims
                                  </p>

                                  <div
                                    className={`rounded-lg p-3 ${
                                      project.claimableTokens.available
                                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50"
                                        : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <Gift
                                          className={`h-4 w-4 mr-2 ${
                                            project.claimableTokens.available
                                              ? "text-green-600 dark:text-green-400"
                                              : "text-gray-500 dark:text-gray-400"
                                          }`}
                                        />
                                        <div>
                                          <p
                                            className={`text-sm font-medium ${
                                              project.claimableTokens.available
                                                ? "text-green-700 dark:text-green-300"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}
                                          >
                                            {project.claimableTokens.amount}{" "}
                                            {project.claimableTokens.symbol}
                                          </p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {project.claimableTokens.available
                                              ? "Available to claim now"
                                              : project.claimableTokens
                                                  .claimDate
                                              ? `Available from ${formatDate(
                                                  project.claimableTokens
                                                    .claimDate
                                                )}`
                                              : "Not yet available"}
                                          </p>
                                        </div>
                                      </div>

                                      {project.claimableTokens.available && (
                                        <Link
                                          href={`https://${project.projectId}.soneium.com/claim`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 py-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
                                        >
                                          Claim Tokens
                                        </Link>
                                      )}

                                      {!project.claimableTokens.available &&
                                        project.claimableTokens.claimDate && (
                                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-3.5 w-3.5 mr-1" />
                                            <span>
                                              {new Date(
                                                project.claimableTokens.claimDate
                                              ) > new Date()
                                                ? "Upcoming"
                                                : "Pending"}
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Link
                                  href={`https://astarsurge.io/account/${participationData.address}/project/${project.projectId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-lg transition-colors"
                                >
                                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                  View on Astar Surge
                                </Link>

                                {project.withdrawalEligible && (
                                  <Link
                                    href={`https://astarsurge.io/withdraw/${project.agentId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs rounded-lg transition-colors"
                                  >
                                    <Unlock className="h-3.5 w-3.5 mr-1.5" />
                                    Withdraw Assets
                                  </Link>
                                )}

                                <Link
                                  href={`https://${project.projectId}.soneium.com/migrate/${project.agentId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors"
                                >
                                  <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                                  Migrate to Soneium
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                No participation in {project.projectName}{" "}
                                detected
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="mb-2 sm:mb-0">
              <p>Astar Surge Status Checker v1.0.0</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="https://surge.sakefinance.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Official Website
              </Link>
              <Link
                href="https://astar.network"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Astar Network
              </Link>
              <Link
                href="https://soneium.org/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Soneium
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
