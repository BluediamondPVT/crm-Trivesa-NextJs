// src/models/Company.js
import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    status: {
      type: String,
      enum: ['Active', 'Non Active', 'Process', 'Listed'],
      default: 'Listed',
    },
    website: {
      type: String,
    },
    description: {
      type: String,
    },
    // Aap aage chalkar isme aur fields add kar sakte ho (e.g. HR Name, Vacancies)
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);

export default Company;