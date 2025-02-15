import { NextResponse } from 'next/server';
import { decentroConfig } from '@/config/decentro';

export async function POST(request: Request) {
  try {
    const { panNumber } = await request.json();

    const response = await fetch(`${decentroConfig.baseUrl}/kyc/pan/verify`, {
      method: 'POST',
      headers: {
        'client_id': decentroConfig.clientId,
        'client_secret': decentroConfig.clientSecret,
        'module_secret': decentroConfig.moduleSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference_id: `pan_${Date.now()}`,
        pan_number: panNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to verify PAN' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: 'verified',
      name: data.data.name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 