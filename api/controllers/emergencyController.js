const Emergency = require("../models/Emergency")
const { ObjectId } = require('mongoose').Types;

const getAllEmergencies = async (req, res) => {
    const emergencies = await Emergency.find().lean()
    if (!emergencies?.length) {
        return res.status(400).json({ message: 'No emergencies found' })
    }

    res.status(200).json(emergencies)
}

const getSingleEmergency = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Emergency ID required' });
    }

    try {
        // Check if id is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Emergency ID' });
        }

        const emergency = await Emergency.findById(id).exec();

        if (!emergency) {
            return res.status(404).json({ message: 'Emergency not found' });
        }

        return res.status(200).json({ message: 'Emergency found', emergency });
    } catch (error) {
        console.error('Error finding emergency:', error);
        return res.status(500).json({ message: 'Failed to fetch emergency details', error: error.message });
    }
}


const createEmergency = async (req, res) => {
    const { title, description, place, latitude, longitude, user, condition, status } = req.body
    if (!title || !description || !place || !latitude || !longitude || !user || !condition) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const emergency = await Emergency.create({ title, description, place, latitude, longitude, user, condition, status })

    if (emergency) {
        return res.status(201).json({message: "emergency created", emergency})
    } else {
        return res.status(400).json({ message: 'Unable to create emergency' })
    }
}


const updateEmergency = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Emergency ID required' });
    }

    const updateFields = req.body.newEmergency; // Assuming your updated emergency object is under newEmergency key
    
    try {
        const updatedEmergency = await Emergency.findByIdAndUpdate(id, updateFields, { new: true }).exec();
        if (!updatedEmergency) {
            return res.status(404).json({ message: 'Emergency not found' });
        }
        return res.status(200).json({ message: 'Emergency updated successfully', emergency: updatedEmergency });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update emergency', error: error.message });
    }
}


module.exports = {
    getAllEmergencies,
    getSingleEmergency,
    createEmergency,
    updateEmergency
}