import { NextRequest, NextResponse } from "next/server";
import { getDemoMetadataUri } from "@/mock/demo-nft";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get("tokenId");

  if (!tokenId) {
    return NextResponse.json({ error: "Missing tokenId" }, { status: 400 });
  }

  try {
    const tokenURI = getDemoMetadataUri(BigInt(tokenId));
    return NextResponse.json({ tokenURI });
  } catch (error) {
    console.error("Error fetching token URI:", error);
    return NextResponse.json({ error: "Failed to fetch token URI" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
