const { Schema, model } = require('mongoose');

const leaveTypes = [
  'Privilege Leave (PL) or Earned Leave (EL)',
  'Casual Leave (CL)',
  'Sick Leave (SL)',
  'Maternity Leave (ML)',
  'Compensatory Off (Comp-off)',
  'Marriage Leave',
  'Paternity Leave',
  'Bereavement Leave',
  'Loss of Pay (LOP) / Leave Without Pay (LWP)',
];

const leaveBalanceSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  leave_type: {
    type: {
      type: String,
      enum: leaveTypes.map((type) => type.type),
      required: true,
    },
    balance: { type: Number, required: true, default: 10 },
  },
});

const LeaveBalance = model('LeaveBalance', leaveBalanceSchema);

module.exports = LeaveBalance;
