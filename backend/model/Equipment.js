const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  serialNumber: {
    type: String,
    required: [true, 'Serial number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: 50
  },
  owner: {  // Added for employee assignment (e.g., laptops)
    type: String,
    trim: true,
    maxlength: 100
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: 100
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required']
  },
  warrantyEnd: {
    type: Date,
    required: [true, 'Warranty end date is required']
  },
  maintenanceTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: [true, 'Maintenance team is required']
  },
  isScrapped: { 
    type: Boolean, 
    default: false 
  },
  scrapReason: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true,  // createdAt, updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
EquipmentSchema.index({ department: 1 });
EquipmentSchema.index({ maintenanceTeamId: 1 });
EquipmentSchema.index({ isScrapped: 1 });
EquipmentSchema.index({ serialNumber: 1 });

// Virtual for warranty status
EquipmentSchema.virtual('isUnderWarranty').get(function() {
  return this.warrantyEnd > new Date();
});

// Pre-save: Validate warranty > purchase date
EquipmentSchema.pre('save', function(next) {
  if (this.purchaseDate && this.warrantyEnd && this.warrantyEnd <= this.purchaseDate) {
    return next(new Error('Warranty end date must be after purchase date'));
  }
  next();
});

module.exports = mongoose.model("Equipment", EquipmentSchema);
