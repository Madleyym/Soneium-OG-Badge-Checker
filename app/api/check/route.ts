import { NextResponse } from "next/server";

// Mock premium badge eligibility data for testing
// In production, this would be determined by analyzing actual bridge transactions
const premiumBadgeEligibility: Record<string, string> = {
  "0x71c7656ec7ab88b098defb751b7401b5f6d8976f":
    "Bridged 1 ETH via native bridge",
  "0x1234567890123456789012345678901234567890":
    "Bridged 78K ASTR via Astar Network CCIP",
  "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd":
    "Bridged $3.2K USDC via native bridge",
  // Add more addresses for testing as needed
};

// Minimum transaction count required for OG Badge eligibility
const MIN_TRANSACTIONS_REQUIRED = 45;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  // Normalize address for case-insensitive comparison
  const normalizedAddress = address.toLowerCase();

  try {
    // Call the actual API to check for transactions
    const response = await fetch(
      `https://soneium.blockscout.com/api?module=account&action=txlist&address=${address}`
    );

    if (!response.ok) {
      console.error(`Blockscout API error: ${response.status}`);
      return NextResponse.json(
        { error: "Error fetching blockchain data" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const transactions = data.result;

    // Check if transactions array exists and contains data
    if (!Array.isArray(transactions)) {
      return NextResponse.json(
        { error: "Invalid response from blockchain API" },
        { status: 502 }
      );
    }

    const txCount = transactions.length;

    // Check for basic OG Badge eligibility (minimum 45 transactions)
    const isEligible = txCount >= MIN_TRANSACTIONS_REQUIRED;

    const isPremium = Object.keys(premiumBadgeEligibility).some(
      (premiumAddress) => premiumAddress.toLowerCase() === normalizedAddress
    );

    const premiumReason = isPremium
      ? premiumBadgeEligibility[
          Object.keys(premiumBadgeEligibility).find(
            (key) => key.toLowerCase() === normalizedAddress
          ) || ""
        ]
      : "";

    return NextResponse.json({
      found: isEligible,
      transactions: txCount,
      premium: isPremium && isEligible,
      premiumReason: isPremium && isEligible ? premiumReason : "",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to check address" },
      { status: 500 }
    );
  }
}
