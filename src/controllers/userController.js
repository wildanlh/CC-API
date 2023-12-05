const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// CREATE NEW USER
const addUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ where: { email: req.body.email } });

    if (existingUser) {
      return res.status(409).send({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const pictureUrl = req.body.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.fullName)}`;

    const newUser = {
      username: req.body.username,
      fullName: req.body.fullName,
      address: req.body.address,
      contact: req.body.contact,
      email: req.body.email,
      password: hashedPassword,
      picture: pictureUrl,
    };

    await User.create(newUser);
    return res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(400).send({ error: 'Registration failed', details: error.message });
  }
};

// GET ALL REGISTERED USER
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'cannot fetch the users' });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// UPDATE USER BY ID
const updateUserById = async (req, res) => {
  try {
    const updated = await User.update(req.body, {
      where: { userId: req.params.id },
    });
    if (updated[0] > 0) {
      res.status(200).send({ message: 'User updated successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// DELETE USER BY ID
const deleteUserById = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { userId: req.params.id },
    });
    if (deleted) {
      res.status(200).send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFavoriteTalentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Use the userId to fetch the user's favored talents from your database
    // Assuming you have a function in your database model to retrieve favored talents for a user
    const favoredTalents = await User.findFavoriteTalents(userId);

    res.status(200).json(favoredTalents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favored talents', details: error.message });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getFavoriteTalentsForUser,
};
