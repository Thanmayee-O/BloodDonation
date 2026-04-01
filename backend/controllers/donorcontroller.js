import { Donor } from '../model/donor.js';

// Haversine formula to calculate distance between two coordinates (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const registerDonor = async (req, res) => {
    try {
        const { name, age, bloodGroup, address, area, pincode, latitude, longitude, email, phone } = req.body;

        // Validation
        if (!name || !age || !bloodGroup || !address || !area || !pincode || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Check if donor with same phone/email already exists
        if (phone || email) {
            const existingDonor = await Donor.findOne({
                $or: [
                    { phone: phone },
                    { email: email }
                ]
            });

            if (existingDonor) {
                return res.status(400).json({
                    success: false,
                    message: 'Donor with this email/phone already registered'
                });
            }
        }

        // Create new donor
        const newDonor = new Donor({
            name,
            age,
            bloodGroup,
            address,
            area,
            pincode,
            latitude,
            longitude,
            email,
            phone
        });

        const savedDonor = await newDonor.save();

        res.status(201).json({
            success: true,
            message: 'Donor registered successfully',
            data: savedDonor
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering donor',
            error: error.message
        });
    }
};

export const searchDonor = async (req, res) => {
    try {
        const { bloodGroup, latitude, longitude, area, pincode } = req.query;

        // Validation
        if (!bloodGroup) {
            return res.status(400).json({
                success: false,
                message: 'Blood group is required'
            });
        }

        let matchedDonors = [];

        // Search by area (case-insensitive contains match)
        if (area) {
            const areaQuery = { 
                bloodGroup: bloodGroup,
                area: { $regex: area, $options: 'i' }  // Contains match, case-insensitive
            };

            matchedDonors = await Donor.find(areaQuery);

            // If no donors found in the specified area, return empty result with appropriate message
            if (matchedDonors.length === 0) {
                return res.status(200).json({
                    success: true,
                    count: 0,
                    message: `No donors found in ${area}`,
                    data: []
                });
            }

            // Donors found in the area
            return res.status(200).json({
                success: true,
                count: matchedDonors.length,
                message: `Found ${matchedDonors.length} donor(s) in ${area}`,
                data: matchedDonors
            });
        }
        // Alternative: Pincode-based search
        else if (pincode) {
            const query = { 
                bloodGroup: bloodGroup,
                pincode: pincode
            };
            matchedDonors = await Donor.find(query);

            if (matchedDonors.length === 0) {
                return res.status(200).json({
                    success: true,
                    count: 0,
                    message: `No donors found with pincode ${pincode}`,
                    data: []
                });
            }

            return res.status(200).json({
                success: true,
                count: matchedDonors.length,
                message: `Found ${matchedDonors.length} donor(s) with pincode ${pincode}`,
                data: matchedDonors
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please provide area or pincode to search'
            });
        }
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching donors',
            error: error.message
        });
    }
};

export const getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.find().sort({ registeredAt: -1 });
        res.status(200).json({
            success: true,
            count: donors.length,
            data: donors
        });
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching donors',
            error: error.message
        });
    }
};
