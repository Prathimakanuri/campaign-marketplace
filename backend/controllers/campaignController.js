const Campaign = require('../models/Campaign');

/**
 * @desc    Create a new campaign
 * @route   POST /api/campaign
 * @access  Private (Brand only)
 */
exports.createCampaign = async (req, res, next) => {
    try {
        // Associate the logged-in user with the campaign
        req.body.createdBy = req.user.id;

        const campaign = await Campaign.create(req.body);

        res.status(201).json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        // Pass validation or system errors to global handler
        next(error);
    }
};

/**
 * @desc    Get all campaigns available in the marketplace
 * @route   GET /api/campaign
 * @access  Private (Influencer/Brand)
 */
exports.getCampaigns = async (req, res, next) => {
    try {
        // Populate creator details to show who owns the campaign
        const campaigns = await Campaign.find().populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            count: campaigns.length,
            data: campaigns,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Allows an Influencer to apply to a specific campaign
 * @route   POST /api/campaign/:id/apply
 * @access  Private (Influencer only)
 */
exports.applyToCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ success: false, error: 'Campaign not found' });
        }

        // Check if user already exists in the applicants array
        if (campaign.applicants.includes(req.user.id)) {
            return res.status(400).json({ success: false, error: 'You have already applied to this campaign' });
        }

        // Add user ID to applicants and save
        campaign.applicants.push(req.user.id);
        await campaign.save();

        res.status(200).json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get the list of influencers who applied to a specific campaign
 * @route   GET /api/campaign/:id/applicants
 * @access  Private (Owner/Brand only)
 */
exports.getApplicants = async (req, res, next) => {
    try {
        // Populate applicant details for the brand to review
        const campaign = await Campaign.findById(req.params.id).populate('applicants', 'name email');

        if (!campaign) {
            return res.status(404).json({ success: false, error: 'Campaign not found' });
        }

        // Ensure only the creator (or an admin) can view applicants
        if (campaign.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to view applicants for this campaign' });
        }

        res.status(200).json({
            success: true,
            count: campaign.applicants.length,
            data: campaign.applicants,
        });
    } catch (error) {
        next(error);
    }
};
