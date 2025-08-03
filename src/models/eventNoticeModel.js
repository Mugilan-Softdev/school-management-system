const eventSchema = new mongoose.Schema({
  institution: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Institution", 
    required: true 
  },
  title: { type: String, required: true },
  description: String,
  start: { type: Date, required: true },
  end: { type: Date },
  audience: { 
    type: String, 
    enum: ["all", "teachers", "students", "parents"], 
    default: "all" 
  },
  grades: [{ type: String }],
  notificationSent: { type: Boolean, default: false }
}, { timestamps: true });