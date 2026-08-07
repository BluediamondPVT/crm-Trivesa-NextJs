import mongoose from "mongoose";

const WebLeadSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    businessEmail: {
      type: String,
      required: true, 
    },
    phone: {
      type: String,
     
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