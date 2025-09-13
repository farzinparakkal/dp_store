const Offer = require('../MongoDb/models/Offer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'offer-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

exports.uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

//Offers
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ offers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch offers", details: err.message });
  }
};

// Create a new offer
exports.createOffer = async (req, res) => {
  try {
    console.log('Received offer creation request:', req.body);
    console.log('Received files:', req.file);
    
    // Validate image upload
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const offerData = {
      image: `/uploads/${req.file.filename}`,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      createdBy: req.user ? req.user._id : null
    };

    console.log('Creating offer with data:', offerData);

    const newOffer = new Offer(offerData);
    await newOffer.save();
    
    console.log('Offer created successfully:', newOffer);
    res.status(201).json({ message: "Offer created successfully", offer: newOffer });
  } catch (err) {
    console.error('Offer creation error:', err);
    res.status(500).json({ error: "Failed to create offer", details: err.message });
  }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ error: "Offer not found" });
        }
        await Offer.deleteOne({ _id : offerId });
        res.status(200).json({ message: "Offer deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete offer", details: err.message });
    }
};

// Update an offer
exports.updateOffer = async (req, res) => {
  try {
    console.log('Received offer update request:', req.body);
    console.log('Received files:', req.file);
    
    const { offerId } = req.params;
    const updates = {};

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Handle image upload if new image is provided
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
      console.log('New image uploaded:', updates.image);
    }

    // Handle isActive status
    if (req.body.isActive !== undefined) {
      updates.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    }

    console.log('Updating offer with:', updates);

    Object.assign(offer, updates); // Merge changes
    await offer.save();

    console.log('Offer updated successfully:', offer);
    res.status(200).json({ message: "Offer updated successfully", offer });
  } catch (err) {
    console.error('Offer update error:', err);
    res.status(500).json({ error: "Failed to update offer", details: err.message });
  }
};
