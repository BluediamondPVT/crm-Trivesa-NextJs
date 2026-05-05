import mongoose from "mongoose";

// 🚀 1. NAYA SLAB SCHEMA (Ab ye Min, Max, aur Amount accept karega)
const SlabSchema = new mongoose.Schema({
  minJoinees: Number,
  maxJoinees: Number,
  amount: Number,
});

// 2. Contact Person Schema
const ContactPersonSchema = new mongoose.Schema({
  name: String,
  designation: String,
  phone: String,
  email: String,
});

// 3. Opening Schema
const OpeningSchema = new mongoose.Schema({
  title: String,
  experience: String,
  salary: String,
  vacancies: Number,
  expiryDate: Date,
  description: String,

  // Role-Specific Payouts
  payoutType: {
    type: String,
    enum: ["Flat Amount", "Percentage", "Slab Wise"],
    default: "Flat Amount",
  },
  flatAmount: Number,
  percentageValue: Number,
  slabs: [SlabSchema], // 🚀 Naya SlabSchema yahan use ho raha hai
});

// 4. Main Company Schema
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

    // General Company Terms
    payoutDetails: {
      payoutDuration: String,
      replacementTime: String,
      paymentTerms: String,
    },

    contactPersons: [ContactPersonSchema],
    openings: [OpeningSchema],
  },
  { timestamps: true },
);

const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);
export default Company;
