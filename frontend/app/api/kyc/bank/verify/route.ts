import { NextResponse } from 'next/server';
import { decentroConfig } from '@/config/decentro';

export async function POST(request: Request) {
  try {
    const { accountNumber, ifsc } = await request.json();

    const response = await fetch(`${decentroConfig.baseUrl}/kyc/bank/verify`, {
      method: 'POST',
      headers: {
        'client_id': decentroConfig.clientId,
        'client_secret': decentroConfig.clientSecret,
        'module_secret': decentroConfig.moduleSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference_id: `bank_${Date.now()}`,
        account_number: accountNumber,
        ifsc_code: ifsc,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to verify bank account' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: 'verified',
      account_holder_name: data.data.account_holder_name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 