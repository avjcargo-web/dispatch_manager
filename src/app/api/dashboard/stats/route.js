import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/dashboard-data";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
