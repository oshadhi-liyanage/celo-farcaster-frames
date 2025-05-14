import { type NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  await prisma.user.create({
    data: {
      address: address,
      isVerified: true,
    },
  });
  return NextResponse.json({ message: "User created" }, { status: 200 });
}
