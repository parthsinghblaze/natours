const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.route('/top-5-tours').get(tourController.aliasTopTours, tourController.getAllTours);
router.route("/stats").get(tourController.tourStats);
router.route('/montly-plan/:year').get(tourController.getMontyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;