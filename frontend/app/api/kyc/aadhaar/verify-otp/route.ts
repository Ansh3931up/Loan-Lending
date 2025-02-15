import { NextResponse } from 'next/server';
import { decentroConfig } from '@/config/decentro';

export async function POST(request: Request) {
  try {
    const { aadhaarNumber, otp } = await request.json();

    const response = await fetch(`${decentroConfig.baseUrl}/kyc/aadhaar/otp/verify`, {
      method: 'POST',
      headers: {
        'client_id': decentroConfig.clientId,
        'client_secret': decentroConfig.clientSecret,
        'module_secret': decentroConfig.moduleSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference_id: `aadhaar_${Date.now()}`,
        aadhaar_number: aadhaarNumber,
        otp,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to verify OTP' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: 'verified',
      name: data.data.full_name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 