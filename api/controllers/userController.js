const User = require('../models/User')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
}

const getSingleUser = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: 'User ID required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    res.status(200).json({message:"gotten user sucessfully", user: user})
}

const searchUsers = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    const regex = new RegExp(query, 'i'); // 'i' flag for case-insensitive search

    const users = await User.find({
        $or: [
            { username: { $regex: regex } },
            { email: { $regex: regex } },
            { phoneNumber: isNaN(query) ? undefined : Number(query) }, // Check if query is a number for phoneNumber
            { address: { $regex: regex } },
            { medicalHistory: { $regex: regex } },
            { currentMedication: { $regex: regex } },
            { vaccination: { $regex: regex } },
            { emergencyContactName: { $regex: regex } },
            { relationship: { $regex: regex } },
            { emergencyContactNumber: isNaN(query) ? undefined : Number(query) } // Check if query is a number for emergencyContactNumber
        ].filter(Boolean) // Remove undefined values from the $or array
    }).select('-password -refreshToken');

    if (!users.length) {
        return res.status(404).json({ message: 'No users found' });
    }

    res.json(users);
};


// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { username, password, roles, email, phoneNumber } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd, email, phoneNumber }
        : { username, "password": hashedPwd, roles,  email, phoneNumber }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const { _id, username, email, password, roles, phoneNumber, age, address, medicalHistory, currentMedication, vaccination, emergencyContactName, relationship, emergencyContactNumber,profileUrl } = req.body;

    // Confirm data 
    if (!_id || !username || !Array.isArray(roles) || !roles.length || !email || !phoneNumber) {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    // Does the user exist to update?
    const user = await User.findById(_id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec();

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate email' });
    }

    user.username = username;
    user.roles = roles;
    user.email = email;
    user.phoneNumber = phoneNumber;

    if (age) {
        user.age = age;
    }

    if (address) {
        user.address = address;
    }

    if (medicalHistory) {
        user.medicalHistory = medicalHistory;
    }

    if (currentMedication) {
        user.currentMedication = currentMedication;
    }

    if (vaccination) {
        user.vaccination = vaccination;
    }

    if (emergencyContactName) {
        user.emergencyContactName = emergencyContactName;
    }

    if (relationship) {
        user.relationship = relationship;
    }

    if (emergencyContactNumber) {
        user.emergencyContactNumber = emergencyContactNumber;
    }

    if (profileUrl) {
        user.profileUrl = profileUrl;
    }

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10); // salt rounds 
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated`, user: updatedUser });
}


// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    await user.deleteOne()

    const reply = `Username ${user.username} with ID ${user._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getSingleUser,
    searchUsers
}
