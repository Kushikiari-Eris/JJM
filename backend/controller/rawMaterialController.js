const RawMaterial = require('../models/rawMaterialModels'); // Update path as necessary

// Add Raw Material function
const addRawMaterial = async (req, res) => {
    try {
        const { productName, category, location, status } = req.body;

        // Validate sizes field
        let sizes = req.body.sizes;
        if (!sizes) {
            return res.status(400).json({ message: 'Sizes field is required' });
        }

        // Parse sizes if it's a string
        if (typeof sizes === 'string') {
            sizes = JSON.parse(sizes); // Convert JSON string to array
        }

        // Check for image upload
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const image = req.file.filename; // Filename saved by multer

        // Ensure required sizes are provided
        const requiredSizes = ['small', 'medium', 'large'];
        const missingSizes = requiredSizes.filter(requiredSize => 
            !sizes.some(size => size.size === requiredSize)
        );
        if (missingSizes.length > 0) {
            return res.status(400).json({ message: `Missing required sizes: ${missingSizes.join(', ')}` });
        }

        // Create the new raw material
        const newRawMaterial = new RawMaterial({
            productName,
            image,
            category,
            location,
            status: status || 'In Stock', // Default to 'In Stock'
            sizes: sizes.map(size => ({
                size: size.size,
                stock: Number(size.stock), // Ensure stock is a number
            })),
        });

        // Save to the database
        const savedRawMaterial = await newRawMaterial.save();
        return res.status(201).json(savedRawMaterial);
    } catch (error) {
        console.error('Error adding raw material:', error);
        return res.status(500).json({ message: 'Server error, please try again' });
    }
};

// Show all raw materials
const showAllRawMaterial = async (req, res) => {
    try {
        const rawMaterials = await RawMaterial.find(); // Fetch all raw materials
        return res.status(200).json(rawMaterials);
    } catch (error) {
        console.error('Error fetching raw materials:', error);
        return res.status(500).json({ message: 'Server error, please try again' });
    }
};

// Edit raw material
const editRawMaterial = async (req, res) => {
    try {
        const { id } = req.params; // Get raw material ID
        const { productName, category, location, status } = req.body;

        // Parse sizes if it's a string
        let sizes = req.body.sizes;
        if (sizes && typeof sizes === 'string') {
            sizes = JSON.parse(sizes); // Convert JSON string to array
        }

        // Check for image upload
        let image;
        if (req.file) {
            image = req.file.filename; // Use new file if uploaded
        }

        // Validate sizes if provided
        if (sizes) {
            const requiredSizes = ['small', 'medium', 'large'];
            const missingSizes = requiredSizes.filter(requiredSize => 
                !sizes.some(size => size.size === requiredSize)
            );
            if (missingSizes.length > 0) {
                return res.status(400).json({ message: `Missing required sizes: ${missingSizes.join(', ')}` });
            }
        }

        // Prepare update fields
        const updatedFields = {
            productName,
            category,
            location,
            status,
            ...(sizes && { sizes: sizes.map(size => ({
                size: size.size,
                stock: Number(size.stock) // Ensure stock is a number
            })) }),
            ...(image && { image }), // Update image if new file is uploaded
        };

        // Update the raw material in the database
        const updatedRawMaterial = await RawMaterial.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!updatedRawMaterial) {
            return res.status(404).json({ message: 'Raw material not found' });
        }

        return res.status(200).json(updatedRawMaterial);
    } catch (error) {
        console.error('Error updating raw material:', error);
        return res.status(500).json({ message: 'Server error, please try again' });
    }
};

// Delete raw material
const deleteRawMaterial = async (req, res) => {
    try {
        const { id } = req.params; // Get raw material ID

        // Find and delete the raw material
        const deletedRawMaterial = await RawMaterial.findByIdAndDelete(id);
        if (!deletedRawMaterial) {
            return res.status(404).json({ message: 'Raw material not found' });
        }

        return res.status(200).json({ message: 'Raw material deleted successfully' });
    } catch (error) {
        console.error('Error deleting raw material:', error);
        return res.status(500).json({ message: 'Server error, please try again' });
    }
};

module.exports = {
    addRawMaterial,
    showAllRawMaterial,
    editRawMaterial,
    deleteRawMaterial,
};
