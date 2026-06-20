import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import WebLead from "@/models/WebLead";

// Helper for CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(req) {
  // Handle CORS preflight request
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await req.json();
    const { companyName, businessEmail, phone, message, source } = body;

    // Validate required fields
    if (!companyName || !businessEmail) {
      return NextResponse.json(
        { error: "Company Name and Business Email are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate Business Email (block personal domains)
    const blockedDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'rediffmail.com', 
      'protonmail.com', 'zohomail.com', 'outlook.com', 'live.com', 
      'icloud.com', 'ymail.com'
    ];
    
    const emailParts = businessEmail.split('@');
    if (emailParts.length === 2) {
      const emailDomain = emailParts[1].toLowerCase();
      if (blockedDomains.includes(emailDomain)) {
        return NextResponse.json(
          { error: "Please provide a valid corporate/business email address." },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Create new WebLead
    const newLead = new WebLead({
      companyName,
      businessEmail,
      phone,
      message,
      source: source || "Website",
      status: "New",
    });

    // Save to database
    await newLead.save();

    // Return success response
    return NextResponse.json(
      { message: "Lead submitted successfully.", lead: newLead },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error creating web lead:", error);
    return NextResponse.json(
      { error: "Failed to submit lead. Please try again later." },
      { status: 500, headers: corsHeaders }
    );
  }
}
