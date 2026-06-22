import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/dashboard-data";
import { getMissingDatabaseEnvVars, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Database configuration is incomplete.",
        missingEnvVars: getMissingDatabaseEnvVars(),
      },
      { status: 503 }
    );
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
