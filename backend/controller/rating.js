const Rating = require('../model/rating');
const Store = require('../model/store');

const recalculateStoreRating = async (storeId) => {
  const ratings = await Rating.find({ store: storeId });
  if (ratings.length === 0) {
    await Store.findByIdAndUpdate(storeId, { averageRating: 0, ratingsCount: 0 });
    return;
  }

  const total = ratings.reduce((sum, r) => sum + r.score, 0);
  const average = total / ratings.length;
  await Store.findByIdAndUpdate(storeId, {
    averageRating: Math.round(average * 10) / 10,
    ratingsCount: ratings.length,
  });
};

exports.submitRating = async (req, res) => {
  try {
    const { storeId, score } = req.body;
    const userId = req.user.id;

    if (!storeId || !score) return res.status(400).json({ message: 'Store ID and score are required' });
    if (score < 1 || score > 5) return res.status(400).json({ message: 'Score must be between 1 and 5' });

    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const existing = await Rating.findOne({ user: userId, store: storeId });
    if (existing) {
      existing.score = score;
      await existing.save();
      await recalculateStoreRating(storeId);
      return res.status(200).json({ message: 'Rating updated', rating: { id: existing._id, score } });
    }

    const rating = await Rating.create({ user: userId, store: storeId, score });
    await recalculateStoreRating(storeId);

    return res.status(201).json({ message: 'Rating submitted', rating: { id: rating._id, score } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Rating already exists for this store' });
    }
    return res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
};

exports.getStoresWithUserRatings = async (req, res) => {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (address) filter.address = { $regex: address, $options: 'i' };

    const stores = await Store.find(filter);
    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        const userRating = await Rating.findOne({ user: userId, store: store._id });
        return {
          id: store._id,
          name: store.name,
          address: store.address,
          overallRating: store.averageRating,
          userRating: userRating ? userRating.score : null,
        };
      })
    );

    return res.status(200).json({ stores: storesWithRatings });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch stores', error: err.message });
  }
};
