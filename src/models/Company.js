// src/models/Company.js
import mongoose from "mongoose";

// 1. NAYA SCHEMA: Commercials ke Slabs ke liye
const SlabSchema = new mongoose.Schema({
  slabDetails: String,
});

// 2. NAYA SCHEMA: Commercials ki Category ke liye
const CommercialRuleSchema = new mongoose.Schema({
  category: String,
  slabs: [SlabSchema], // Us category ke andar multiple slabs ka array
});

const ContactPersonSchema = new mongoose.Schema({
  name: String,
  designation: String,
  phone: String,
  email: String,
});

const OpeningSchema = new mongoose.Schema({
  title: String,
  experience: String,
  salary: String,
  vacancies: Number,
  expiryDate: Date,
  description: String,
});

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    address: { type: String },
    companyType: {
      type: String,
      enum: ["BPO", "KPO", "Non BPO", "IT"],
      default: "Non BPO",
    },
    natureOfBusiness: { type: String },
    description: { type: String },
    internalRemark: { type: String },
    status: { type: String, default: "Active" },

    // Payout Nested Object (UPDATED)
    payoutDetails: {
      commercials: [CommercialRuleSchema], // THE FIX: Ye ab Array hai
      payoutDuration: String,
      replacementTime: String,
      paymentTerms: String,
    },

    contactPersons: [ContactPersonSchema],
    openings: [OpeningSchema],
  },
  { timestamps: true },
);

// Avoid OverwriteModelError
const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);
export default Company;
