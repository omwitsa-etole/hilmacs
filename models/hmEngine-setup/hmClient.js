var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// hilmacs client Schema
var clientSchema = mongoose.Schema({
  hcName:{ type:String, required: true },
  hcSlogan:{ type:String, required: true },
  hcAddress:{ type:String, required: true },
  hcRegNo:{ type:String, required: true },
  hcId:{ type:Number,default: 0  },
  hcLogo:{ type:String,default:"/img/defaults/logoBadge.jpg" },
  hcDate:{ type:Date, default:Date.now }
});

function hc_NextSequence(name) {
   var ret = db.counters.findAndModify(
          {
            query: { _id: name },
            update: { $inc: { hcId: 1 } },
            new: true
          }
   );

   return ret.seq;
}

var collectionName = 'hm_client';
var hmClient = mongoose.model('hm_client' , clientSchema ,collectionName);

// Get client
module.exports.getClient = async function (callback,limit) {
   const data = await hmClient.find().sort({hcDate: -1}).limit(limit);
   callback(null,data)
};

// Get current client
module.exports.getCurrentClient = async function (callback) {
   const data = await hmClient.find({}).sort({hcDate: -1}).limit(1);
   callback(null,data)
};


// get one hilmacs client by id
module.exports.getClientById = async function (id , callback) {
   const data = await hmClient.findById(id);
   callback(null,data)
};


// add hilmacs client
module.exports.addClient = async function (newClientData , callback) {
   const data = await hmClient.create(newClientData);
   callback(null,data)
};

// update hilmacs client
module.exports.updateClientGen = async function (id , updateData , options, callback) {
   var query = {_id:id}
   var update = {
     hcName: updateData.hcName,
     hcSlogan: updateData.hcSlogan,
     hcAddress: updateData.hcName,
     hcRegNo: updateData.hcName,
     hcHilmacsId: updateData.hcName,
     hcLogo: updateData.hcName
   }
   const data = await hmClient.findOneAndUpdate(query, update,{new:true});
   callback(null,data)
};

// update hilmacs client
module.exports.updateClientOne = async function (id , updateData , field, callback) {
   var query = {_id:id}
   var update = {
     hcName: updateData.value
   }
   const data = await hmClient.findOneAndUpdate(query, update ,{new:true});
	callback(null,data)
};

// Delete Client
module.exports.removeClient = async (id, callback) => {
	var query = {_id: id};
	const data = await hmClient.remove(query);
	callback(null,data)
}
