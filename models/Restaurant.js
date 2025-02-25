const mongoose = require('mongoose');
 

const RestaurantSchema = new mongoose.Schema({

    name : {
        type : String,
        require : [true,'Please add name'],
        unique : true,
        trim : true,
        maxLength : [50,'Name cannot be more than 50 char']

    },
    address :{
        type : String,
        require : [true,'please add address'],

    },
    district : {
        type : String,
        require :[true,'please add district']
    },
    province : {
        type : String,
        require : [true,'please add province']

    },
    postalCode : {
        type : String,
        require : ['true,please add postalCode'],
        maxLength : [50,'postalCode cannot be more than 5 digits']
    },
    tel : {
        type : String
    },
    region:{
        type : String,
        require : [true, 'Please add region']
    }



},{
    toJSON: {virtuals:true},
    toObject:{virtuals:true}
});

HospitalSchema.virtual('reservation',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'hospital',
    justOne:false

});

module.exports = mongoose.model('Restaurant', RestaurantSchema);