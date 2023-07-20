const express = require('express');
const router = express.Router();
const LeaveBalance = require('../models/LeaveBalances');

// GET leave balances for all employees
router.get('/', async (req, res) => {
  try {
    const leaveBalances = await LeaveBalance.find();
    res.json(leaveBalances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET leave balance for a specific employee by ID
router.get('/:employee_id', async (req, res) => {
  try {
    const leaveBalance = await LeaveBalance.findOne({ employee_id: req.params.employee_id });
    if (!leaveBalance) {
      return res.status(404).json({ message: 'Leave balance not found for the employee' });
    }
    res.json(leaveBalance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update leave balance for a specific employee by ID and leave type
router.put('/:employee_id/:leave_type', async (req, res) => {
  try {
    const { balance } = req.body;

    // Find the existing leave balance by employee_id and leave_type
    let leaveBalance = await LeaveBalance.findOne({
      employee_id: req.params.employee_id,
      leave_type: req.params.leave_type,
    });
    if (!leaveBalance) {
      return res.status(404).json({ message: 'Leave balance not found for the employee and leave type' });
    }

    // Update leave balance
    leaveBalance.balance = balance;

    // Save the updated leave balance
    await leaveBalance.save();
    res.json(leaveBalance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
