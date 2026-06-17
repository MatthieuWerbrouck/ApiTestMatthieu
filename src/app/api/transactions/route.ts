import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/enums";
import { getMonthRange } from "@/lib/month";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  const categoryId = request.nextUrl.searchParams.get("categoryId");
  const { start, end } = getMonthRange(month);

  const transactions = await prisma.transaction.findMany({
    where: {
      date: { gte: start, lt: end },
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { amount, type, date, description, categoryId } = body;

  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
  }
  if (type !== TransactionType.INCOME && type !== TransactionType.EXPENSE) {
    return NextResponse.json({ error: "type must be INCOME or EXPENSE" }, { status: 400 });
  }
  if (!date || Number.isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: "date is required and must be valid" }, { status: 400 });
  }
  if (!categoryId || typeof categoryId !== "string") {
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      date: new Date(date),
      description: description || null,
      categoryId,
    },
    include: { category: true },
  });

  return NextResponse.json(transaction, { status: 201 });
}
