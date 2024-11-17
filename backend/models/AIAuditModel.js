const mongoose = require('mongoose');

// Define the AuditPlan schema
const auditPlanSchema = new mongoose.Schema({
  AuditName: {
    type: String,
    required: true,
  },
  AssignedAuditor: {
    type: String,
    required: true,
  },
  Scope: {
     type: String, 
     required: true,
  },
  ScheduledDate: {
    type: Date,
    required: true,
  },
  Priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  Status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Planned'], // Include 'Planned'
    default: 'Scheduled',
  },
  AuditType: {
    type: String,
    enum: ['Security', 'Performance', 'Compliance', 'Operational', 'Product Audit'], // Include 'Product Audit'
    required: true,
  },
  NotificationsSent: {
    type: Boolean,
    required: true,
  },
  ExpectedCompletionDate: {
    type: Date,
    required: true,
  },
  Checklist: 
    {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
});

// Create the AuditPlan model
const AuditPlan = mongoose.model('AuditPlan', auditPlanSchema);

module.exports = AuditPlan;
