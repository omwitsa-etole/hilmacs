var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// hilmacs client Schema
var controlSchema = mongoose.Schema({
  hcState:{ type:String,default:null },
  hcName:{ type:String,defualt:null },
  hcValue:{type:String,default:null },
  hcDate:{ type:Date, default:Date.now }
});

var collectionName = 'hm_controls';
var hmControls = mongoose.model('hm_controls' , controlSchema ,collectionName);

// Get client controls
module.exports.getControls = async function (callback,limit) {
   const data = await hmControls.find({}).limit(limit);
   callback(null,data);
};

// get one hilmacs client controls by role
module.exports.getControlsByName = async function (name , callback) {
   var query = {hcName:name}
   const data = await hmControls.findOne(query).sort({hcDate: -1});
   callback(null,data);
};

// supreme control unit
module.exports.апроситьлицензию = async function (callback) {
   var query = {hcName:'admin'}
   var data = await hmControls.findOne(query);
   if(!data){
	    data = {}
		data.hcName = 'admin'
		
		data.hcValue = '123456789'
		data.hcState = null
	    bcrypt.genSalt(10, function(err, salt) {
		 bcrypt.hash(data.hcValue, salt, async function(err, hash) {
			data.hcValue = hash ;
			const datas = await hmControls.create(data);
			callback(null,datas);
		 });
	   });
   }else{
	callback(null,data);
    }
};


// add hilmacs client controls
module.exports.newControl = async function (control , callback) {
  const data = await hmControls.create(control);
  callback(null,data);
};

// add hilmacs client secret
module.exports.userSecret = function(data, callback) {
   bcrypt.genSalt(10, function(err, salt) {
     bcrypt.hash(data.hcValue, salt, async function(err, hash) {
        data.hcValue = hash ;
        const datas = await hmControls.create(data);
		callback(null,datas);
     });
   });
}


// update hilmacs client controls
module.exports.updateControl = async function (name , updateData , options, callback) {
   var query = {_hcName:name}
   var update = {
     hcName: updateData.hcName,
     hcState: updateData.hcState
   }
   const datas = await hmControls.findOneAndUpdate(query, update );
   callback(null,datas);
};
