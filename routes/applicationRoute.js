const express = require('express');

const {
  createApplication,
  getOpportunityApplications,
  getTouristApplications,
  deleteApplication,
  acceptApplication,
  rejectApplication,
} = require('../controllers/applicationController');

const {
  createApplicationValidator,
  getOpportunityApplicationsValidator,
  deleteApplicationValidator,
  acceptApplicationValidator,
  rejectApplicationValidator,
} = require('../utils/validators/applicationValidator');


const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.rootApplicationsRouter = {
  getOpportunityApplications: [
    isAuth, allowedTo('HOST', 'ADMIN'), getOpportunityApplicationsValidator, getOpportunityApplications
  ],
};

router.
  route('/')
  .post(isAuth, allowedTo('TOURIST'), createApplicationValidator, createApplication)
  .get(isAuth, allowedTo('TOURIST'), getTouristApplications)
  .delete(isAuth, allowedTo('TOURIST'), deleteApplicationValidator, deleteApplication);


router.patch('/accept', isAuth, allowedTo('HOST'), acceptApplicationValidator, acceptApplication);
router.patch('/reject', isAuth, allowedTo('HOST'), rejectApplicationValidator, rejectApplication);

module.exports = router;
