const User = require('../MongoDb/models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, phoneNumber, address } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile fields
    if (name !== undefined) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;

    // Save updated user
    const updatedUser = await user.save();

    // Return updated user without password
    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: userResponse 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
