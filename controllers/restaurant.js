const Reservation = require('../models/Reservation');
const Restauranr = require('../models/Restaurant');

exports.getHospital = async (req,res,next) =>{
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) res.status(400).json({success:false});

        res.status(200).json({success:true,data: hospital});
    } catch (error) {
        res.status(400).json({success:false});
    }
    


};

exports.getHospitals = async (req,res,next) =>{
        let query;
        const reqQuery = {...req.query};
        const removeFields = ['select','sort','page','limit'];

        removeFields.forEach(param=>delete reqQuery[param])
        console.log(reqQuery);

        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt,gte,lt,lte,in)\b/g, match=>`$${match}`);

        query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

        if (req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createAt');
        }

        const page = parseInt(req.query.page,10)|| 1;

        const limit = parseInt(req.query.limit,10)||25;

        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Hospital.countDocuments();
        query = query.skip(startIndex).limit(limit);

        const pagination = {};

        if (endIndex < total){
            pagination.next = {
                page:page+1,
                limit
            }
        }

        if (startIndex > 0){
            pagination.prev = {
                page:page-1,
                limit
            }
        }

    try {

    const hospitals = await query; 
    res.status(200).json({
        success:true, 
        count:hospitals.length,
        pagination,
        data : hospitals
    });
    
    } catch (error) {
        res.status(400).json({success:false});
    }
    
};

exports.createHospital = async (req,res,next) =>{
    const hospital = await Hospital.create(req.body);
    res.status(201).json({success:true,data:hospital});
    
    
};

exports.updateHospital = async (req,res,next) =>{

    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators: true
        });

        if (!hospital) res.status(400).json({success:false});

        res.status(200).json({success:true,data:hospital});

    } catch (error) {
        res.status(400).json({success:false});
    }


    
    
};

exports.deleteHospital = async (req,res,next) =>{
    

    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                success:false,
                msg:`cannot find hospital with id ${req.params.id}`
            });
        }

        await Appointment.deleteMany({hospital:req.params.id});
        await Hospital.deleteOne({_id:req.params.id});
        res.status(200).json({success:true,data:{}});

    } catch (error) {
        res.status(400).json({success:false});
    }
    
};







/*
//getall lt gt or etc
exports.getHospitals = async (req,res,next) =>{
        let query;
        let queryStr=JSON.stringify(req.query);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/
            , match=> `$${match}`
        );
        query = Hospital.find(JSON.parse(queryStr));
    try {

    const hospitals = await query; 
    res.status(200).json({
        success:true, 
        count:hospitals.length, 
        data : hospitals
    });
    
    } catch (error) {
        res.status(400).json({success:false});
    }
    
};

//sort and select fields getall

exports.getHospitals = async (req,res,next) =>{
        let query;
        const reqQuery = {...req.query};
        const removeFields = ['select','sort'];

        removeFields.forEach(param=>delete reqQuery[param])
        console.log(reqQuery);

        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt,gte,lt,lte,in)\b/g, match=>`$${match}`);

        query = Hospital.find(JSON.parse(queryStr));

        if (req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createAt');
        }

    try {

    const hospitals = await query; 
    res.status(200).json({
        success:true, 
        count:hospitals.length, 
        data : hospitals
    });
    
    } catch (error) {
        res.status(400).json({success:false});
    }
    
};

*/