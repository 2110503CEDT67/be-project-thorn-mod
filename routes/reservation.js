const express = require('express');
const {getAppointments,getAppointment,addAppointment,updateAppointment,deleteAppointment} = require('../controllers/reservation');
const {protect,authorize} = require('../middleware/auth');



const router = express.Router({mergeParams:true});


router.route('/').get(protect,getAppointments).post(protect,authorize('user','admin'),addAppointment);
router.route('/:id').get(protect,getAppointment).put(protect,authorize('user','admin'),updateAppointment).delete(protect,authorize('user','admin'),deleteAppointment);

module.exports = router;
