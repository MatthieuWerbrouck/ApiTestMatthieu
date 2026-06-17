import { NextRequest, NextResponse } from "next/server";
import { getBudgetSummary } from "@/lib/budgets";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  const summary = await getBudgetSummary(month);
  return NextResponse.json(summary);
}
