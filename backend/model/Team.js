const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, 'Team name cannot exceed 50 characters']
  },
  members: [{
    type: String,
    required: [true, 'Technician name is required'],
    trim: true,
    maxlength: 100
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  specialty: {  // Added for team categorization
    type: String,
    enum: ['Mechanics', 'Electricians', 'IT Support', 'HVAC', 'General'],
    default: 'General'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
TeamSchema.index({ teamName: 1 });
TeamSchema.index({ isActive: 1 });
TeamSchema.index({ specialty: 1 });

// Virtual for member count
TeamSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Pre-save: Validate at least 1 member
TeamSchema.pre('save', function(next) {
  if (this.members.length === 0) {
    return next(new Error('Team must have at least one member'));
  }
  next();
});

module.exports = mongoose.model("Team", TeamSchema);
