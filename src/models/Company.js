// src/models/Company.js
import mongoose from 'mongoose';

const ContactPersonSchema = new mongoose.Schema({
  name: String,
  designation: String,
  phone: String,
  email: String
});

const OpeningSchema = new mongoose.Schema({
  title: String,
  experience: String,
  salary: String,
  vacancies: Number,
  expiryDate: Date,
  description: String
});

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String },
  address: { type: String },
  companyType: { type: String, enum: ['BPO', 'KPO', 'Non BPO', 'IT'], default: 'Non BPO' },
  
  // NAYA FIELD ADD KIYA:
  natureOfBusiness: { type: String }, 
  
  description: { type: String },
  status: { type: String, default: 'Active' },
  
  // Payout Nested Object
  payoutDetails: {
    commercials: String,
    payoutDuration: String,
    replacementTime: String,
    paymentTerms: String
  },

  // Arrays for Multiple Contacts and Openings
  contactPersons: [ContactPersonSchema],
  openings: [OpeningSchema]

}, { timestamps: true });

const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);
export default Company;