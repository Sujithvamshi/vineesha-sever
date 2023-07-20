const { Schema, model } = require('mongoose');

const leaveRequestSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  leave_type: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  manager_comment: { type: String },
});

const LeaveRequest = model('LeaveRequest', leaveRequestSchema);

module.exports = LeaveRequest;