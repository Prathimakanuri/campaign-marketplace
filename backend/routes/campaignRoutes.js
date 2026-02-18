const express = require('express');
const {
    createCampaign,
    getCampaigns,
    applyToCampaign,
    getApplicants,
} = require('../controllers/campaignController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router
    .route('/')
    .get(getCampaigns)
    .post(authorize('brand'), createCampaign);

router.post('/:id/apply', authorize('influencer'), applyToCampaign);
router.get('/:id/applicants', authorize('brand'), getApplicants);

module.exports = router;
