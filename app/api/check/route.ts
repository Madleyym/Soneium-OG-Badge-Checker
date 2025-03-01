import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://soneium.blockscout.com/api?module=account&action=txlist&address=${address}`
    );

    const data = await response.json();
    const transactions = data.result;

    return NextResponse.json({
      found: Array.isArray(transactions) && transactions.length > 0,
      transactions: Array.isArray(transactions) ? transactions.length : 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check address" },
      { status: 500 }
    );
  }
}
