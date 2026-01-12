const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { validateSignup, validateLogin, validatePasswordChange } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const TOKEN_EXPIRY = '2h';

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  });
};

exports.signup = async (req, res) => {
  try {
    const error = validateSignup(req.body);
    if (error) return res.status(400).json({ message: error });

    const { name, email, address, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      address,
      password: passwordHash,
      role: 'user',
    });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });
    setAuthCookie(res, token);

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, address },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const error = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });
    setAuthCookie(res, token);

    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.logout = (_req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out' });
};

exports.updatePassword = async (req, res) => {
  try {
    const error = validatePasswordChange(req.body);
    if (error) return res.status(400).json({ message: error });

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isOldValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldValid) return res.status(400).json({ message: 'Old password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 10);
    user.password = newHash;
    await user.save();

    return res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Password update failed', error: err.message });
  }
};
