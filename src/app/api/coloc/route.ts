import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRoommateLedger } from "@/lib/coloc";

export async function GET() {
  const ledger = await getRoommateLedger();
  return NextResponse.json(ledger);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date, description, amount } = body;

  if (!date || Number.isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: "date is required and must be valid" }, { status: 400 });
  }
  if (!description || typeof description !== "string") {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }
  if (typeof amount !== "number" || amount === 0) {
    return NextResponse.json({ error: "amount must be a non-zero number" }, { status: 400 });
  }

  const entry = await prisma.roommateEntry.create({
    data: { date: new Date(date), description, amount },
  });

  return NextResponse.json(entry, { status: 201 });
}
