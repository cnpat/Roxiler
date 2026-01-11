const userModel = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ user });
}

exports.getUser = async (req, res) => {
    const user = await userModel.find();
    res.status(200).json({ user });
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
}

