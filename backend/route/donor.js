import express from 'express';
import { registerDonor, searchDonor, getAllDonors } from '../controllers/donorcontroller.js';

const router = express.Router();

// Register a new donor
router.post('/register', registerDonor);

// Search donors by blood group and location
router.get('/search', searchDonor);

// Get all donors
router.get('/all', getAllDonors);

export default router;
