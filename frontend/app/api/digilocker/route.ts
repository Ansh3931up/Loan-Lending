import { NextResponse } from 'next/server';
import axios from 'axios';

const DECENTRO_CLIENT_ID = 'Loainfy_7_sop';
const DECENTRO_CLIENT_SECRET = '6089f860bb6740c1aa0234f611f06910';
const DECENTRO_MODULE_SECRET = '157b0493ded94d79941bd1974bd30488';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint = 'initiate_session' } = body;
    
    const response = await axios.post(
      `https://in.staging.decentro.tech/v2/kyc/digilocker/${endpoint}`,
      {
        consent: true,
        consent_purpose: "For loan verification",
        reference_id: `REF-${Date.now()}`,
        redirect_url: "http://localhost:3000/digilocker/callback",
        redirect_to_signup: true,
        documents_for_consent: ["ADHAR", "PANCR"]
      },
      {
        headers: {
          'client-id': DECENTRO_CLIENT_ID,
          'client-secret': DECENTRO_CLIENT_SECRET,
          'module-secret': DECENTRO_MODULE_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Decentro Response:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Digilocker API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}