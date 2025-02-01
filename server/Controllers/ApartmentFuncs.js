const Apartment = require('../models/ApartmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.apartmentSignup = async (req, res) => {
  const { name, email, password, address } = req.body;
  const images = req.body.images || [];
  try {
    const existing = await Apartment.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Apartment already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const apartment = new Apartment({
      name,
      email,
      password: hashedPassword,
      address,
      images
    });
    await apartment.save();
    const token = jwt.sign({ id: apartment._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, apartment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.apartmentLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const apartment = await Apartment.findOne({ email });
    if (!apartment) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, apartment.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: apartment._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, apartment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
