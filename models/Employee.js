const { Schema, model } = require('mongoose');

const employeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  department: { type: String, required: true },
  password: { type: String, required: true },
  role :{ type: String, required: true, default:'employee'}
});

const Employee = model('Employee', employeeSchema);

module.exports = Employee;