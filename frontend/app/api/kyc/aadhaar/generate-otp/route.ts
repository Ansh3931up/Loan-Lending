import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { aadhaarNumber } = await request.json();

    // Generate UUID for reference_id
    const reference_id = crypto.randomUUID();

    const requestBody = {
      reference_id,
      consent: true,
      purpose: "for bank account verification",
      aadhaar_number: aadhaarNumber
    };
    console.log('Decentro API Response:', requestBody);
    const response = await fetch(`${process.env.NEXT_PUBLIC_DECENTRO_BASE_URL}v2/kyc/aadhaar/otp/generate`, {
      method: 'POST',
      headers: {
        'client_id': 'Loainfy_7_sop',
        'client_secret': '6089f860bb6740c1aa0234f611f06910',
        'module_secret': '157b0493ded94d79941bd1974bd30488',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    console.log('Decentro API Response:', response);

    const data = await response.json();
    console.log('Decentro API Response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to generate OTP' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in generate OTP:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 