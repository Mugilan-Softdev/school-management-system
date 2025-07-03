const invoiceSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  institution: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Institution", 
    required: true 
  },
  items: [{
    feeType: { type: mongoose.Schema.Types.ObjectId, ref: "Fee" },
    amount: { type: Number, required: true }
  }],
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["pending", "paid", "overdue", "cancelled"], 
    default: "pending" 
  },
  paymentMethod: { type: String }, // Populated on payment
  transactionId: { type: String }  // Razorpay/Stripe reference
}, { timestamps: true });