const Store = require('../model/store');
const User = require('../model/user');
const Rating = require('../model/rating');
const { validateStore } = require('../utils/validation');

exports.createStore = async (req, res) => {
  try {
    const error = validateStore(req.body);
    if (error) return res.status(400).json({ message: error });

    const { name, email, address, owner } = req.body;
    const existingEmail = await Store.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Store email already in use' });

    const ownerUser = await User.findById(owner);
    if (!ownerUser) return res.status(404).json({ message: 'Owner user not found' });
    if (ownerUser.role !== 'owner') return res.status(400).json({ message: 'User must have owner role' });

    const store = await Store.create({ name, email, address, owner });
    ownerUser.store = store._id;
    await ownerUser.save();

    return res.status(201).json({
      store: {
        id: store._id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        rating: store.averageRating,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create store', error: err.message });
  }
};

exports.listStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    const filter = {};

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (address) filter.address = { $regex: address, $options: 'i' };

    const stores = await Store.find(filter).populate('owner', 'name email');
    const storesList = stores.map((s) => ({
      id: s._id,
      name: s.name,
      email: s.email,
      address: s.address,
      rating: s.averageRating,
    }));

    return res.status(200).json({ stores: storesList });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch stores', error: err.message });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id).populate('owner', 'name email');
    if (!store) return res.status(404).json({ message: 'Store not found' });

    return res.status(200).json({
      store: {
        id: store._id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: store.averageRating,
        owner: store.owner,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch store', error: err.message });
  }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('store');
    if (!user || !user.store) return res.status(404).json({ message: 'Store not found for this user' });

    const ratings = await Rating.find({ store: user.store._id })
      .populate('user', 'name email address')
      .sort({ createdAt: -1 });

    const ratingsList = ratings.map((r) => ({
      id: r._id,
      user: {
        id: r.user._id,
        name: r.user.name,
        email: r.user.email,
        address: r.user.address,
      },
      score: r.score,
      createdAt: r.createdAt,
    }));

    return res.status(200).json({
      store: {
        id: user.store._id,
        name: user.store.name,
        averageRating: user.store.averageRating,
      },
      ratings: ratingsList,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch dashboard', error: err.message });
  }
};
