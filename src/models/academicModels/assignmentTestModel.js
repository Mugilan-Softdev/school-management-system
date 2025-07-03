const assignmentSchema = new mongoose.Schema({
  institution: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Institution", 
    required: true 
  },
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  assignedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }, // Teacher
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fileUrl: String,
    submittedAt: Date,
    grade: Number,
    feedback: String
  }]
}, { timestamps: true });