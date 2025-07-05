// src/app/api/transactions/[id]/route.ts
import { connectDB } from '@/lib/mongoose';
import { Transaction } from '@/models/Transaction';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Transaction.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest, { params }: { params: { [key: string]: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    // Perform your update logic here (e.g., update the transaction in the database)
    const updatedTransaction = {
      id,
      ...body,
    };

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}