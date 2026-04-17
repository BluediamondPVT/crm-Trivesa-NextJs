// src/app/api/companies/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

// GET request specific company fetch karne ke liye
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // params.id URL se aayega (e.g. /api/companies/64abc123...)
    const { id } = params;

    const company = await Company.findById(id);

    if (!company) {
      return NextResponse.json({ success: false, message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: company });

  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}