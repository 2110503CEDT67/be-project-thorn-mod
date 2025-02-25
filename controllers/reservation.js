const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

exports.getAppointments = async (req,res,next) => {

        let query = {};
        
        if (req.user.role === 'user'){
            query.user = req.user.id;
        }

        if(req.params.hospitalID){
            query.hospital = req.params.hospitalID;
        }



        // if(req.user.role === 'admin'){
        //     query = Appointment.find();
        // }else if (req.user.role === 'user'){
        //     query = Appointment.find({user:req.user.id});
        // }

        // if (req.params.hospitalID) {
        //     query = Appointment.find({ hospital: req.params.hospitalID });
        // } else {
        //     query = Appointment.find();
        // }

        try {
            const appointments = await Appointment.find(query).populate({
                path:'hospital',
                select:'name province tel'

            });

            res.status(200).json({
                success:true,
                count:appointments.length,
                data:appointments
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                msg:'cannot find appointments'
            });
        }
};

exports.getAppointment = async (req,res,next)=> {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'hospital',
            select: 'name provice tel'
        });
    
        if (!appointment){
            return res.status(404).json({
                success: false,
                msg:`No appointment with id ${req.params.id}`
            });
        }

        res.status(200).json({
            success:true,
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:"cannot find appointment"
        });
    }

};

exports.addAppointment = async (req,res,next) =>{
    try {
        req.body.user = req.user.id;

        const existedAppointment = await Appointment.find({ user: req.user.id });
        if (existedAppointment.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({
                succes:false,
                msg : `User with id : ${req.user.id} has already made 3 appointments`
            });
        }
        //pull hospital data
        req.body.hospital = req.params.hospitalID;
        const hospital = await Hospital.findById(req.params.hospitalID);

        if (!hospital){
            return res.status(404).json({
                success : false,
                msg:`No hospital with id ${req.params.hospitalID}`
            });
        }

        const appointment = await Appointment.create(req.body);
        res.status(200).json({
            success:true,
            data: appointment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:`cannot add appointmentS`
        });
    }

};

exports.updateAppointment = async (req,res,next) =>{

    try {
        

        let appointment = await Appointment.findById(req.params.id);
        
        if (!appointment){
            return res.status(404).json({
                success:false,
                msg:`No appointment with id : ${req.params.id}`
                
            });
        }

        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success:false,
                msg:`User with id : ${req.user.id} has not authorize to this appointment`
                
            });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id,req.body,{
                new :true,
                runValidators:true
        });

        res.status(200).json({
            success: true,
            appointment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:'Cannot update appointmennt'
        });
    }
    

};

exports.deleteAppointment = async (req,res,next)=>{

    
    try {
        
        const appointment = await Appointment.findById(req.params.id);

        if(!appointment){
            return res.status(200).json({
                success:false,
                msg:`No appointment with id : ${req.params.id}`
            });
        }

        if (appointment.user.toString() !== req.user.id && req.user.id !== 'admin'){
            return res.status(401).json({
                success:false,
                msg:`User with id : ${req.user.id} has not authorize to this appointment`
                
            });
        }

         await appointment.deleteOne();

         res.status(200).json({
            success:true,
            data:{}

         });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:'Cannot delete appointment'

        });
    }

};
