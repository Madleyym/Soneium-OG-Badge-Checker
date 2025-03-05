import { NextResponse } from "next/server";

// The snapshot block details
const SNAPSHOT_BLOCK = "3747022";
const SNAPSHOT_HASH =
  "0x9c1a6ef0f3d4cf2ff5844ae0727cdc1c2888650bd6f62bd97e9f8ffa6b8ae430";

// Bridge contract addresses on Soneium
const BRIDGE_CONTRACTS = {
  NATIVE_ETH_BRIDGE: "0x4200000000000000000000000000000000000006",
  USDC_BRIDGE: "0x4200000000000000000000000000000000000011",
  ASTAR_CCIP: "0xE01338496c8b07490Ae642AF53AAa5A8e6645B4C",
};

// Badge NFT contract address - verified contract address on Soneium
const BADGE_CONTRACT = "0x2A21B17E366836e5FFB19bd47edB03b4b551C89d";

// Minimum requirements
const MIN_TRANSACTIONS_REQUIRED = 45;
const MIN_ETH_BRIDGE_AMOUNT = 1; // 1 ETH
const MIN_USDC_BRIDGE_AMOUNT = 2500; // $2.5K USDC
const MIN_ASTAR_BRIDGE_AMOUNT = 70000; // 70K ASTR

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  // Validate Ethereum address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: "Invalid address format" },
      { status: 400 }
    );
  }

  // Normalize address for case-insensitive comparison
  const normalizedAddress = address.toLowerCase();

  try {
    // Check transaction history
    const blockscoutApiUrl = `https://soneium.blockscout.com/api?module=account&action=txlist&address=${normalizedAddress}&endblock=${SNAPSHOT_BLOCK}`;
    console.log(
      `Querying transactions up to block ${SNAPSHOT_BLOCK}: ${blockscoutApiUrl}`
    );

    const response = await fetch(blockscoutApiUrl, {
      headers: { Accept: "application/json" },
      cache: "force-cache", // Cache results to reduce API load
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.status !== "1" || !Array.isArray(data.result)) {
      throw new Error("Invalid response from blockchain API");
    }

    const transactions = data.result;
    const txCount = transactions.length;
    const isEligible = txCount >= MIN_TRANSACTIONS_REQUIRED;

    // Check for bridge transactions
    let isPremium = false;
    let premiumReason = "";
    let bridgeActivity = [];

    if (isEligible) {
      // In a real implementation, we would check for bridge transactions
      // For now we'll skip this complex logic
    }

    // Check if the address actually owns any badges
    // Direct NFT ownership check using token-specific endpoint
    const ownsBadges = await checkBadgeOwnership(normalizedAddress);

    // Return results with badge ownership information
    return NextResponse.json({
      found: isEligible,
      transactions: txCount,
      premium: isPremium,
      premiumReason: premiumReason,
      _source: "blockscout_api",
      badges: {
        ogBadge: ownsBadges.ogBadge,
        premiumBadge: ownsBadges.premiumBadge,
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);

    // Jangan "mengarang" data - informasikan pengguna bahwa data tidak tersedia
    return NextResponse.json(
      {
        found: false,
        transactions: 0,
        premium: false,
        premiumReason: "",
        _source: "api_error",
        _error:
          error.message ||
          "API call failed - transaksi tidak dapat diverifikasi",
        _recoverable: true, // Flag bahwa pengguna bisa mencoba lagi nanti
        badges: {
          ogBadge: false,
          premiumBadge: false,
        },
      },
      { status: 503 }
    ); // Service Unavailable - menandakan bahwa layanan sementara tidak tersedia
  }
}

// Improved badge ownership checking function that handles multiple NFT detection methods
async function checkBadgeOwnership(address: string) {
  // Default result
  let result = {
    ogBadge: false,
    premiumBadge: false,
  };

  try {
    // Method 1: Check using tokenlist endpoint
    const badgeOwnershipUrl = `https://soneium.blockscout.com/api?module=account&action=tokenlist&address=${address}`;
    const response = await fetch(badgeOwnershipUrl, {
      headers: { Accept: "application/json" },
      cache: "force-cache",
    });

    if (response.ok) {
      const data = await response.json();

      if (data && data.status === "1" && Array.isArray(data.result)) {
        // Find tokens from our badge contract
        const badgeTokens = data.result.filter(
          (token: any) =>
            token.contractAddress?.toLowerCase() ===
            BADGE_CONTRACT.toLowerCase()
        );

        // Check for each badge type - try all known token ID formats
        for (const token of badgeTokens) {
          const tokenId = token.tokenID || token.id || token.tokenId;
          if (tokenId === "0" || tokenId === 0 || tokenId === "OG") {
            result.ogBadge = true;
          }
          if (tokenId === "1" || tokenId === 1 || tokenId === "PREMIUM") {
            result.premiumBadge = true;
          }
        }
      }
    }

    // Method 2: If method 1 failed, try direct token balance check
    // This is a fallback in case the first method doesn't detect badges
    if (!result.ogBadge && !result.premiumBadge) {
      const ogBalanceUrl = `https://soneium.blockscout.com/api?module=account&action=tokenbalance&contractaddress=${BADGE_CONTRACT}&address=${address}&tokenid=0`;
      const premiumBalanceUrl = `https://soneium.blockscout.com/api?module=account&action=tokenbalance&contractaddress=${BADGE_CONTRACT}&address=${address}&tokenid=1`;

      // Check OG badge
      const ogResponse = await fetch(ogBalanceUrl, {
        headers: { Accept: "application/json" },
        cache: "force-cache",
      });

      if (ogResponse.ok) {
        const ogData = await ogResponse.json();
        if (ogData && ogData.status === "1" && parseInt(ogData.result) > 0) {
          result.ogBadge = true;
        }
      }

      // Check Premium badge
      const premiumResponse = await fetch(premiumBalanceUrl, {
        headers: { Accept: "application/json" },
        cache: "force-cache",
      });

      if (premiumResponse.ok) {
        const premiumData = await premiumResponse.json();
        if (
          premiumData &&
          premiumData.status === "1" &&
          parseInt(premiumData.result) > 0
        ) {
          result.premiumBadge = true;
        }
      }
    }
  } catch (error) {
    console.error("Error checking badge ownership:", error);
  }
  return result;
}
