import { NextResponse } from "next/server";

// The snapshot block details
const SNAPSHOT_BLOCK = "3747022";
const SNAPSHOT_HASH =
  "0x9c1a6ef0f3d4cf2ff5844ae0727cdc1c2888650bd6f62bd97e9f8ffa6b8ae430";

// Bridge contract addresses on Soneium
const BRIDGE_CONTRACTS = {
  NATIVE_ETH_BRIDGE: "0x4200000000000000000000000000000000000010",
  USDC_BRIDGE: "0x4200000000000000000000000000000000000011", // Example address
  ASTAR_CCIP: "0x4200000000000000000000000000000000000012", // Example address
};

// Minimum requirements
const MIN_TRANSACTIONS_REQUIRED = 45;
const MIN_ETH_BRIDGE_AMOUNT = 1; // 1 ETH
const MIN_USDC_BRIDGE_AMOUNT = 2500; // $2.5K USDC
const MIN_ASTAR_BRIDGE_AMOUNT = 70000; // 70K ASTR

// Known addresses for demo purposes
const KNOWN_ADDRESSES: Record<string, any> = {
  // Regular OG Badge address
  "0xaeabadae3cc5f1d1a5de4903a195bf2796df3455": {
    transactions: 112,
    bridgeActivity: [], // No bridge activity
  },
  // Premium OG Badge addresses with their bridge transactions
  "0xaeabadae3cc5f1d1a5de4903a195002323434482": {
    transactions: 95,
    bridgeActivity: [
      {
        type: "USDC",
        amount: 3200,
        blockNumber: 3645000,
        hash: "0xabcd...",
      },
    ],
  },
  "0x71c7656ec7ab88b098defb751b7401b5f6d8976f": {
    transactions: 87,
    bridgeActivity: [
      {
        type: "ETH",
        amount: 1,
        blockNumber: 3700000,
        hash: "0xdef1...",
      },
    ],
  },
};

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
    // First check if we have known data for this address
    if (normalizedAddress in KNOWN_ADDRESSES) {
      const addressData = KNOWN_ADDRESSES[normalizedAddress];
      const txCount = addressData.transactions;
      const isEligible = txCount >= MIN_TRANSACTIONS_REQUIRED;

      // Check bridge activity for premium status
      let isPremium = false;
      let premiumReason = "";

      if (isEligible && addressData.bridgeActivity.length > 0) {
        // Check each bridge transaction
        for (const bridge of addressData.bridgeActivity) {
          // Make sure the bridge transaction was before the snapshot block
          if (bridge.blockNumber <= parseInt(SNAPSHOT_BLOCK)) {
            if (
              bridge.type === "ETH" &&
              bridge.amount >= MIN_ETH_BRIDGE_AMOUNT
            ) {
              isPremium = true;
              premiumReason = `Bridged ${bridge.amount} ETH via native bridge`;
              break;
            } else if (
              bridge.type === "USDC" &&
              bridge.amount >= MIN_USDC_BRIDGE_AMOUNT
            ) {
              isPremium = true;
              premiumReason = `Bridged $${bridge.amount} USDC via native bridge`;
              break;
            } else if (
              bridge.type === "ASTR" &&
              bridge.amount >= MIN_ASTAR_BRIDGE_AMOUNT
            ) {
              isPremium = true;
              premiumReason = `Bridged ${bridge.amount} ASTR via Astar Network CCIP`;
              break;
            }
          }
        }
      }

      return NextResponse.json({
        found: isEligible,
        transactions: txCount,
        premium: isPremium,
        premiumReason: premiumReason,
        _source: "known_address",
        bridgeActivity: addressData.bridgeActivity,
      });
    }

    // For unknown addresses, we would query the blockchain
    // This is where we would check the real bridge transactions in production

    // 1. Get all transactions for this address before the snapshot block
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

    // 2. If eligible, check for bridge transactions
    let isPremium = false;
    let premiumReason = "";
    let bridgeActivity = [];

    if (isEligible) {
      // In a real implementation, we would:
      // - Filter transactions to bridge contracts
      // - Look for specific methods and amounts
      // - Check event logs for bridge events
      // For this demo, we're not doing actual blockchain analysis
      // but this shows the pattern for how it would be implemented
    }

    return NextResponse.json({
      found: isEligible,
      transactions: txCount,
      premium: isPremium,
      premiumReason: premiumReason,
      _source: "blockscout_api",
      _blockInfo: {
        snapshotBlock: SNAPSHOT_BLOCK,
        snapshotHash: SNAPSHOT_HASH,
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);

    // Fallback to deterministic behavior for demo purposes
    // In a production app, you might want to retry or show an error
    const addressNum = parseInt(normalizedAddress.substring(2, 10), 16);
    const txCount = 10 + (addressNum % 191);
    const isEligible = txCount >= MIN_TRANSACTIONS_REQUIRED;

    // Important: No random premium status in the fallback either
    return NextResponse.json({
      found: isEligible,
      transactions: txCount,
      premium: false,
      premiumReason: "",
      _source: "fallback_deterministic",
      _error: error.message || "API call failed",
    });
  }
}
