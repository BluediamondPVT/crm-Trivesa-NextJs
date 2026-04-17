// src/app/api/companies/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

// GET all companies
export async function GET() {
  try {
    await dbConnect();
    // Sort by newest first
    const companies = await Company.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

// POST new company
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Create a new company document in MongoDB
    const company = await Company.create({
      name: body.name,
      phone: body.phone,
      email: body.email.toLowerCase(),
      address: body.address,
      website: body.website,
      companyType: body.companyType,
      description: body.description,
      status: 'Active', // Default status for new companies
      contactPersons: [], // Empty array by default, will add later
      openings: [] // Empty array by default, will add later
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Company added successfully!',
      data: company 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating company:', error);
    
    // Check for duplicate email error from MongoDB
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, message: 'Failed to create company' }, { status: 500 });
  }
}