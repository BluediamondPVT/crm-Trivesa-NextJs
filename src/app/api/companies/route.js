// src/app/api/companies/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

// GET route waisa hi rahega...
export async function GET() {
  try {
    await dbConnect();
    const companies = await Company.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: companies });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

// NAYA POST ROUTE
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Ab hum pura 'body' object directly DB mein pass kar rahe hain
    
    // POST function ke andar
    const company = await Company.create({
      name: body.name,
      phone: body.phone,
      email: body.email?.toLowerCase(),
      address: body.address,
      website: body.website,
      companyType: body.companyType,
      
      // NAYA FIELD ADD KIYA:
      natureOfBusiness: body.natureOfBusiness,
      
      description: body.description,
      status: body.status || 'Active',
      payoutDetails: body.payoutDetails,
      contactPersons: body.contactPersons,
      openings: body.openings 
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Client added successfully!',
      data: company 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating company:', error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Failed to create company' }, { status: 500 });
  }
}