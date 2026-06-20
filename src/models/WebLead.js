import mongoose from "mongoose";

const WebLeadSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    businessEmail: {
      type: String,
      required: true, // Email sabme hai, toh isko required kar sakte hain
    },
    phone: {
      type: String,
      // required: true HATA DIYA HAI kyunki 2nd form mein phone number nahi hai
    },
    message: {
      type: String,
    },
    source: {
      type: String,
      default: "Website",
    },
    status: {
      type: String,
      default: "New",
      enum: ["New", "Contacted", "Closed"],
    },
  },
  {
    timestamps: true,
  }
);

const WebLead = mongoose.models.WebLead || mongoose.model("WebLead", WebLeadSchema);

export default WebLead;