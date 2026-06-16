import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/enums";

export async function GET(request: NextRequest) {
  const typeParam = request.nextUrl.searchParams.get("type");

  if (typeParam && typeParam !== TransactionType.INCOME && typeParam !== TransactionType.EXPENSE) {
    return NextResponse.json({ error: "Invalid type filter" }, { status: 400 });
  }

  const type = typeParam as TransactionType | null;

  const categories = await prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, type, budget } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (type !== TransactionType.INCOME && type !== TransactionType.EXPENSE) {
    return NextResponse.json({ error: "type must be INCOME or EXPENSE" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      name,
      type,
      budget: budget === undefined || budget === null || budget === "" ? null : Number(budget),
    },
  });

  return NextResponse.json(category, { status: 201 });
}
