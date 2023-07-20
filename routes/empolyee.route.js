const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new employee
router.post('/', async (req, res) => {
  try {
    const { name, email, phone_number, department, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      name,
      email,
      phone_number,
      department,
      password: hashedPassword, // Save the hashed password to the database
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update an existing employee
router.put('/:id', async (req, res) => {
  try {
    const {name, email, phone_number, department } = req.body;

    // Find the existing employee by ID
    let employee = await findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee properties
    employee.name = name;
    employee.email = email;
    employee.phone_number = phone_number;
    employee.department = department;

    // Save the updated employee
    await employee.save();
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE an employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await findByIdAndRemove(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the employee by their email
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If the password is valid, the employee is authenticated
    res.json({ message: 'Successfully signed in', employee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
