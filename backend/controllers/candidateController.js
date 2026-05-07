import Candidate from '../models/Candidate.js';
import { config } from '../config.js';

const normalizeImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${config.port}`;
  // Handle various path formats
  let normalizedImage = image;
  if (!normalizedImage.startsWith('/')) {
    normalizedImage = '/' + normalizedImage;
  }
  // Remove 'uploads/' prefix if present (we'll add /uploads automatically)
  normalizedImage = normalizedImage.replace(/^\/uploads\//i, '/');
  
  // If it looks like a filename (not an absolute path), prepend /uploads
  if (!normalizedImage.includes('localhost') && !normalizedImage.includes('http')) {
    normalizedImage = `/uploads${normalizedImage}`;
  }
  
  return `${backendUrl}${normalizedImage}`;
};

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ isDeleted: false });
    const normalized = candidates.map((c) => ({
      _id: c._id,
      id: c._id,
      name: c.name,
      party: c.party,
      image: normalizeImageUrl(c.image),
      blockchainId: c.blockchainId,
    }));
    res.json({ candidates: normalized });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch candidates', error: error.message });
  }
};

export const addCandidate = async (req, res) => {
  try {
    const { name, party, image } = req.body;

    if (!name || !party || !image) {
      return res.status(400).json({ message: 'Missing required fields: name, party, image' });
    }

    if (!name.trim()) {
      return res.status(400).json({ message: 'Candidate name cannot be empty' });
    }

    if (!party.trim()) {
      return res.status(400).json({ message: 'Party name cannot be empty' });
    }

    // Allow both absolute URLs and relative paths
    let imageToStore = image;
    if (!image.startsWith('http://') && !image.startsWith('https://')) {
      // If it's a relative path with /uploads, keep it as is
      // If it's just a filename or path without /uploads, normalize it
      if (!image.includes('/uploads')) {
        imageToStore = image.startsWith('/') ? image : `/${image}`;
      }
    }

    const candidate = new Candidate({ 
      name: name.trim(), 
      party: party.trim(), 
      image: imageToStore 
    });
    await candidate.save();

    res.status(201).json({ 
      message: 'Candidate added successfully', 
      candidate: {
        ...candidate.toObject(),
        image: normalizeImageUrl(candidate.image)
      }
    });
  } catch (error) {
    console.error('❌ Add candidate error:', error);
    res.status(500).json({ message: 'Failed to add candidate', error: error.message });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, party, image } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (name) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Candidate name cannot be empty' });
      }
      candidate.name = name.trim();
    }

    if (party) {
      if (!party.trim()) {
        return res.status(400).json({ message: 'Party name cannot be empty' });
      }
      candidate.party = party.trim();
    }

    if (image) {
      let imageToStore = image;
      if (!image.startsWith('http://') && !image.startsWith('https://')) {
        if (!image.includes('/uploads')) {
          imageToStore = image.startsWith('/') ? image : `/${image}`;
        }
      }
      candidate.image = imageToStore;
    }

    await candidate.save();

    res.json({ 
      message: 'Candidate updated successfully', 
      candidate: {
        ...candidate.toObject(),
        image: normalizeImageUrl(candidate.image)
      }
    });
  } catch (error) {
    console.error('❌ Update candidate error:', error);
    res.status(500).json({ message: 'Failed to update candidate', error: error.message });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.isDeleted = true;
    await candidate.save();

    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete candidate', error: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Store relative path for consistency
    const imagePath = `/uploads/${file.filename}`;
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${config.port}`;
    const imageUrl = `${backendUrl}${imagePath}`;

    console.log('✅ Image uploaded:', imageUrl);

    res.json({ 
      imageUrl,
      filename: file.filename,
      path: imagePath
    });
  } catch (error) {
    console.error('❌ Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};
