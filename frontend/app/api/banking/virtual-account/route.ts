import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = 'https://in.staging.decentro.tech/v2';

export async function POST(request: Request) {
  try {
    console.log('Received request at /api/banking/virtual-account');
    const body = await request.json();
    console.log('Request Body:', body);

    const headers = {
      'client-id': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_ID!,
      'client-secret': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_SECRET!,
      'module-secret': process.env.NEXT_PUBLIC_DECENTRO_CORE_BANKING_SECRET!,
      'Content-Type': 'application/json'
    };

    console.log('Using Headers:', {
      'client-id': headers['client-id'],
      'module-secret': 'XXXX' // masked for security
    });

    const response = await axios.post(
      `${BASE_URL}/banking/account/virtual`,
      body,
      { headers }
    );
    
    console.log('Decentro API Response:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Enhanced error logging
    console.error('Full Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      requestHeaders: error.config?.headers
    });
    
    return NextResponse.json(
      { 
        error: error.response?.data || error.message,
        details: 'Virtual account creation failed. Please check configuration.'
      },
      { status: error.response?.status || 500 }
    );
  }
} 