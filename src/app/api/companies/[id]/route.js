// src/app/api/companies/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // THE FIX: Next.js ke naye version mein params ko await karna padta hai
    const resolvedParams = await params; 
    const { id } = resolvedParams;

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

// NAYA DELETE ROUTE
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    // Params ko await karna Next.js ka naya rule hai (jaisa pehle fix kiya tha)
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Database se company dhoondh ke delete karo
    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return NextResponse.json({ success: false, message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Company deleted successfully' });

  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}