import mongoose from "mongoose";

const InstitutionSchema = new mongoose.Schema(
  {
    // Your existing fields remain unchanged
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      pinCode: String
    },
    subscriptionPlan: {
      type: String,
      enum: ["trial", "basic", "premium"],
      default: "trial"
    },
    studentCapacity: {
      type: Number,
      default: 5000
    },
    isActive: {
      type: Boolean,
      default: false // Changed to require verification
    },

    // Only these OTP fields are added:
    isVerified: {
      type: Boolean,
      default: false,
      required: true
    },
    otp: {
      type: String,
      required: true,
      select: false
    },
    otpExpiry: {
      type: Date,
      required: true,
      select: false
    }
  },
  { timestamps: true } // Keeping your existing timestamps
);

const InstitutionModel =
  mongoose.models.Institution || mongoose.model("Institution", InstitutionSchema);

export default InstitutionModel;