var mongoose = require('mongoose');

/*
   // hilmacs class Schema
*/

// hilmacs classSchema
var classesSchema = mongoose.Schema({
  hcName:{ type:String, required: true },
  hcStreams:{ type:String, default:'none' },
  hcDate:{ type:Date, default:Date.now }
});

var collectionName_Class = 'hm_structures_classes';
var hmClasses = mongoose.model('hm_structures_classes' , classesSchema ,collectionName_Class);

// Get get all classes offered
module.exports.getClasses = async (callback,limit) => {
   const data = await hmClasses.find({}).sort({hcDate: -1}).limit(limit);
   callback(null,data)
};

// get one class by id
module.exports.getClassById = async (id , callback) => {
   const data = await hmClasses.findById(id);
   callback(null,data)
};


// add class offered
module.exports.addClass = async (newClass , callback) => {
   const data = await hmClasses.create(newClass);
   callback(null,data)
};

// update class
module.exports.updateClass =  async (id , updateData , options, callback)  => {
   var query = {_id:id}
   var update = {
     hcName: updateData.hcClassName,
     hcStreams:updateData.hcStreams
   }
   const data = await hmClasses.findOneAndUpdate(query, update );
   callback(null,data)
};

//count registered classes
module.exports.countClasses = async function (callback) {
  var query = {};
  const data = await hmClasses.find(query );
  callback(null,data.length)
};

// Delete class
module.exports.removeClassName = async (id, callback) => {
	var query = {_id: id};
	const data = await hmClasses.findOneAndDelete(query);
	callback(null,data)
}

/*
   // hilmacs subjects Schema
*/

// hilmacs subjectsSchema
var subjectsSchema = mongoose.Schema({
  hcName:{ type:String, required: true },
  hcUnit:{ type:String, default:'none' },
  hcDate:{ type:Date, default:Date.now }
});

var collectionName_Subject = 'hm_structures_subjects';
var hmSubjects = mongoose.model('hm_structures_subjects' , subjectsSchema ,collectionName_Subject);

// Get get all subjects offered
module.exports.getSubjects =  async (callback,limit)  => {
   const data = await hmSubjects.find().sort({hcDate: -1}).limit(limit);
   callback(null,data)
};

// get one subject by id
module.exports.getSubjectById = async  (id , callback)  => {
   const data = await  hmSubjects.findById(id);
   callback(null,data)
};

// add subject offered
module.exports.addSubject = async (newSubject , callback)  => {
   const data = await hmSubjects.create(newSubject);
   callback(null,data)
};

// update class
module.exports.updateSubject =async (id , updateData , options, callback)  => {
   var query = {_id:id}
   var update = {
     hcName: updateData.hcName,
     hcUnit:updateData.hcUnits
   }
   const data = await hmSubjects.findOneAndUpdate(query, update );
   callback(null,data)
};

//count registered subjects
module.exports.countSubjects = async function (callback) {
  var query = {};
  const data = await hmSubjects.find(query);
  callback(null,data.length)
};

// Delete class
module.exports.removeSubject = async (id, callback) => {
	var query = {_id: id};
	const data = await hmSubjects.findOneAndDelete(query);
	callback(null,data)
}

/*
   // hilmacs dorms Schema
*/

// hilmacs dormsSchema
var dormsSchema = mongoose.Schema({
  hcDormName:{ type:String, required: true },
  hcCaptain:{ type:String, default:'none' },
  hcAsstCaptain:{ type:String, default:'none' },
  hcWarden:{ type:String, default:'none' },
  hcBeds:{ type:Number, default:0 },
  hcDate:{ type:Date, default:Date.now }
});

var collectionName_Dorm = 'hm_structures_dorms';
var hmDorms = mongoose.model('hm_structures_dorms' , dormsSchema ,collectionName_Dorm);

// Get get all classes offered
module.exports.getDorms = async (callback,limit) => {
   const data = await hmDorms.find().sort({hcDate: -1}).limit(limit);
   callback(null,data)
};

// get one class by id
module.exports.getDormById = async (id , callback) => {
   const data = await hmDorms.findById(id);
   callback(null,data)
};


// add class offered
module.exports.addDorm = async (newDorm , callback) => {
   const data = await  hmDorms.create(newDorm);
   callback(null,data)
};

// update class
module.exports.updateDorm =  async (id , updateData , options, callback)  => {
   var query = {_id:id}
   var update = {
     hcDormName:updateData.hcDormName,
     hcCaptain:updateData.hcDormName,
     hcAsstCaptain:updateData.hcDormName,
     hcWarden:updateData.hcDormName,
     hcBeds:updateData.hcDormName
   }
   const data = await hmDorms.findOneAndUpdate(query, update );
   callback(null,data)
};

//count registered dorms
module.exports.countDorms = async function (callback) {
  var query = {};
  const data = await hmDorms.find(query);
  callback(null,data.length)
};

// Delete class
module.exports.removeDorm = async (id, callback) => {
	var query = {_id: id};
	const data = await hmDorms.findOneAndDelete(query);
	callback(null,data)
	
}
