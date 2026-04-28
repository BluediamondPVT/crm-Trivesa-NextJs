import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: {
        // 🔥 UPDATE: Saare 7 enterprise roles yahan define kar diye hain
        values: [
          "superadmin", 
          "admin", 
          "ta_head", 
          "recruiter", 
          "executive", 
          "hr", 
          "finance"
        ],
        message: "{VALUE} is not a valid role", // Dynamic message
      },
      required: [true, "Role is required"], // Role ab compulsory hai
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Pre-save middleware to hash password if modified
// FIX: Removed 'next' parameter entirely for Next.js async compatibility
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  // Mongoose automatically catches errors in async functions
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==========================================
// THE FIX FOR NEXT.JS SERVERLESS:
// Yeh check karega ki agar 'User' model pehle se bana hua hai,
// toh purana use karo, warna naya banao.
// ==========================================
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;