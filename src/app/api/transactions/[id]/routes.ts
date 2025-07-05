// src/app/api/transactions/[id]/route.ts
import { connectDB } from '@/lib/mongoose';
import { Transaction } from '@/models/Transaction';
import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: { id: string };
}

export async function DELETE(_: NextRequest, { params }: Context) {
  await connectDB();
  await Transaction.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const body = await req.json()
  const updated = await Transaction.findByIdAndUpdate(params.id, body, { new: true })
  return NextResponse.json(updated)
}
