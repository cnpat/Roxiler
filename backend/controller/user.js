const User = require('../model/user');
const bcrypt = require('bcrypt');
const { validateAdminUser } = require('../utils/validation');

exports.createUser = async (req, res) => {
  try {
    const error = validateAdminUser(req.body);
    if (error) return res.status(400).json({ message: error });

    const { name, email, address, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      address,
      password: passwordHash,
      role: role || 'user',
    });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const filter = {};

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (address) filter.address = { $regex: address, $options: 'i' };
    if (role) filter.role = role;

    const users = await User.find(filter).select('-password').populate('store', 'name address averageRating');
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').populate('store', 'name address averageRating');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const result = {
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };

    if (user.role === 'owner' && user.store) {
      result.store = {
        name: user.store.name,
        address: user.store.address,
        rating: user.store.averageRating,
      };
    }

    return res.status(200).json({ user: result });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const Store = require('../model/store');
    const Rating = require('../model/rating');
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    return res.status(200).json({
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};
