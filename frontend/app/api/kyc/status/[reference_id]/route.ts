import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = 'https://in.staging.decentro.tech/v2';

export async function GET(
  request: Request,
  { params }: { params: { reference_id: string } }
) {
  try {
    console.log('Checking KYC status for reference:', params.reference_id);

    const headers = {
      'client-id': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_ID!,
      'client-secret': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_SECRET!,
      'module-secret': process.env.NEXT_PUBLIC_DECENTRO_MODULE_SECRET!,
      'Content-Type': 'application/json'
    };

    console.log('Making request to Decentro KYC status API');
    const response = await axios.get(
      `${BASE_URL}/kyc/status/${params.reference_id}`,
      { headers }
    );

    console.log('KYC Status Response:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('KYC Status Check Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch KYC status',
        details: error.response?.data || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 