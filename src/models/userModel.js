const userSchema = new mongoose.Schema({
  institution: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Institution", 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["admin", "teacher", "student", "parent"], 
    required: true 
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Role-specific fields (conditionally required)
  studentId: { type: String }, // For students
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For parents
  subjects: [{ type: String }], // For teachers
  lastLogin: { type: Date }
}, { timestamps: true });