const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const LeaveBalance = require('../models/LeaveBalances');
// GET all leave requests
router.get('/', async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().populate('employee_id', 'name department');
    res.json(leaveRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific leave request by ID
router.get('/:id', async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id).populate('employee_id', 'name department');
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json(leaveRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/getleaves', async (req, res) => {
  try {
    const { employee_id,status } = req.body;
    const leaveRequest = await LeaveRequest.find({ employee_id,status })
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json(leaveRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new leave request
router.post('/', async (req, res) => {
  try {
    const { employee_id, start_date, end_date, leave_type, reason } = req.body;

    const leaveRequest = new LeaveRequest({
      employee_id,
      start_date,
      end_date,
      leave_type,
      reason,
      status: 'pending', // Set the initial status as 'Pending'
    });

    await leaveRequest.save();
    res.status(201).json(leaveRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update leave request status by manager
router.patch('/:id', async (req, res) => {
  try {
    const { status, manager_comment } = req.body;

    // Find the existing leave request by ID
    let leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update leave request properties
    leaveRequest.status = status;
    leaveRequest.manager_comment = manager_comment;
    if(status=="approved"){
      let leaveBalance = await LeaveBalance.findOne({
        employee_id: leaveRequest.employee_id,
        leave_type: leaveRequest.leave_type,
      });
      leaveBalance.balance -= 1
      await leaveBalance.save()
    }
    // Save the updated leave request
    await leaveRequest.save();
    res.json(leaveRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a leave request
router.delete('/:id', async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findByIdAndRemove(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json({ message: 'Leave request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
