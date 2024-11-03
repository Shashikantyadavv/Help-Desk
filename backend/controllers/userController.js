const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'BoostIsMySecret', {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

const getAllUsers = async (req, res) => {
  // console.log(req);
  try {
    const users = await User.find().select('-password -__v'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const createUser = async (req, res) => {
  console.log(req.body);
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await User.deleteOne({ _id: id });
    res.status(201).json({ message: "User Deleted" });
  }
  catch (error) {
    res.status(500).json({ message: 'Error in deleting User' });
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  createUser,
  deleteUser,
};
