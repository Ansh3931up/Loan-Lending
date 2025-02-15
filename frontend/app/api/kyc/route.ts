import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = 'https://in.staging.decentro.tech/v2';
const headers = {
  'client-id': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_ID!,
  'client-secret': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_SECRET!,
  'module-secret': process.env.NEXT_PUBLIC_DECENTRO_MODULE_SECRET!,
  'Content-Type': 'application/json'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await axios.post(
      `${BASE_URL}/kyc/public_registry/validate`,
      body,
      { headers }
    );

    console.log("elloH",response.data);
    
    // Specific handling for E00054
    if (response.data.responseCode === 'E00054') {
      return NextResponse.json({
        error: 'Service Setup In Progress',
        message: 'Our verification service is being configured. Please try again in a few hours.',
        technicalDetails: 'Commission plan configuration pending',
        code: 'E00054'
      }, { status: 503 });
    }
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data;
    
    // Handle E00054 in catch block as well
    if (errorData?.responseCode === 'E00054') {
      return NextResponse.json({
        error: 'Service Setup In Progress',
        message: 'Our verification service is being configured. Please try again in a few hours.',
        technicalDetails: 'Commission plan configuration pending',
        code: 'E00054'
      }, { status: 503 });
    }
    
    return NextResponse.json({
      error: 'Verification Failed',
      message: errorData?.message || 'Unable to complete verification',
      technicalDetails: errorData?.responseCode || error.message
    }, { status: error.response?.status || 500 });
  }
} 