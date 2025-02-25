const express = require('express');
const {protect,authorize} = require('../middleware/auth');
const appointmentRoute = require('./reservation');

const {getHospitals, getHospital,createHospital,updateHospital,deleteHospital} = require('../controllers/restaurant');
const router = express.Router();

router.use('/:hospitalID/appointments',appointmentRoute)
router.route('/').get(getHospitals).post(protect,authorize('admin'),createHospital);
router.route('/:id').get(getHospital).put(protect,authorize('admin'),updateHospital).delete(protect,authorize('admin'),deleteHospital);

module.exports = router;