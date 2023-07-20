const { Schema, model } = require('mongoose');

const leaveBalanceSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  leave_type: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
});

const LeaveBalance = model('LeaveBalance', leaveBalanceSchema);

module.exports = LeaveBalance;
