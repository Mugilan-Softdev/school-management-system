const attendanceSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["present", "absent", "half-day"], 
    required: true 
  },
  markedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  } // Teacher/admin who recorded
}, { timestamps: true });