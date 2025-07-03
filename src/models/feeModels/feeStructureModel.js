const feeSchema = new mongoose.Schema({
  institution: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Institution", 
    required: true 
  },
  name: { type: String, required: true }, // e.g., "Tuition Fee"
  amount: { type: Number, required: true },
  frequency: { 
    type: String, 
    enum: ["one-time", "monthly", "quarterly", "annual"], 
    default: "monthly" 
  },
  applicableTo: { 
    type: String, 
    enum: ["all", "grade-wise", "activity-based"] 
  },
  grade: { type: String }, // If grade-specific
  isActive: { type: Boolean, default: true }
}, { timestamps: true });