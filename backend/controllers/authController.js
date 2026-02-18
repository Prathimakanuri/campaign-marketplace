const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a new user (Brand or Influencer)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Create user - Mongoose handles validation
        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        // Generate token and send response
        sendTokenResponse(user, 201, res);
    } catch (error) {
        // Pass error to global error handler
        next(error);
    }
};

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password presence
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user and include password (which is excluded by default in schema)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Use schema method to check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Successful login - send token
        sendTokenResponse(user, 200, res);
    } catch (error) {
        // Pass error to global error handler
        next(error);
    }
};

/**
 * Helper to generate JWT, create response structure, and send
 * @param {Object} user - User document
 * @param {Number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const sendTokenResponse = (user, statusCode, res) => {
    // Create token with role included in payload
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};
