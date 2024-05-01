var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// hilmacs examTypeSchema
var examTypeSchema = mongoose.Schema({
  hcExam:{ type:String, required: true },
  hcAbbr:{ type:String, required: true },
  hcStreams:{ type:String, required: true,default:"" },
  files:{type:Array,default:[]},
  instructors:{type:Array,default:[]},
  users:{type:Array,default:[]},
  hcStatus:{ type:Number, default:0 },
  questions:{type:Array,default:[]},
  hcTime:{ type:Date, equired: true,default:Date.now },
  hcDate:{ type:Date, default:Date.now }
});

var collectionName = 'hm_exam_types';
var hmExamType = mongoose.model('hm_exam_types' , examTypeSchema ,collectionName);

// Get get all exams offered
module.exports.getExamType = async function (callback,limit) {
   const data = await hmExamType.find().sort({hcDate: -1}).limit(limit);
   callback(null,data)
};

// get one examtype by id
module.exports.getExamTypeById = async function (id , callback) {
   const data = await hmExamType.findById(id);
   if(callback === undefined){return data}
   callback(null,data)
};


// add examtype offered
module.exports.addExamType = async function (newExamType , callback) {
   const data = await hmExamType.create(newExamType);
   callback(null,data)
};

module.exports.addExamQuestion = async function (id,newQuestion , callback) {
	const exam = await hmExamType.find({_id:id})
   const data = await hmExamType.findByIdAndUpdate(exam._id,{$set:{questions:exam.questions.push(newQuestion)}});
   if(callback){
	callback(null,data)
   }else{return data}
};

// update examtype
module.exports.updateExamType = async function (id , updateData , options, callback) {
   var query = {_id:id}
   var update = {
     hcExam: updateData.hcExam,
     hcAbbr:updateData.hcAbbr,
	 hcTime:updateData.hcTime,
     hcStatus: updateData.hcStatus,
   }
   const data = await hmExamType.findOneAndUpdate(query, update );
   if(updateData.files && updateData.files.title){
	   await hmExamType.findOneAndUpdate(query, {$set:{files:data.files.push(updateData.files)}} );
   }
   callback(null,data)
};

// update examtype status
module.exports.updateExamTypeStatus = async  function (id , updateData , field, callback) {
   var query = {_id:id}
   var update = {
     hcStatus: updateData.value
   }
   const data = await hmExamType.findOneAndUpdate(query, update );
   callback(null,data)
};

// Delete examtype
module.exports.removeExamType = async (id, callback) => {
	var query = {_id: id};
	const data = await hmExamType.findOneAndDelete(query);
	callback(null,data)
}

/*
   // hilmacs term Schema
*/

// hilmacs examTypeSchema
var TermSchema = mongoose.Schema({
  hcTerm:{ type:String, required: true },
  hcStatus:{ type:Number, default:0 },
  hcDate:{ type:Date, default:Date.now }
});

var collectionName_Term = 'hm_terms';
var hmTerms = mongoose.model('hm_terms' , TermSchema ,collectionName_Term);

// Get get all terms offered
module.exports.getTerms = async function (callback,limit) {
   const data = await hmTerms.find().sort({hcDate: -1}).limit(limit);
   callback(null,data)
};

// get one examtype by id
module.exports.getTermById = async function (id , callback) {
   const data = await hmTerms.findById(id);
   callback(null,data)
};


// add examtype offered
module.exports.addTerm = async function (newTerm , callback) {
   const data = await hmTerms.create(newTerm);
   callback(null,data)
};

// update examtype
module.exports.updateTerm = async function (id , updateData , options, callback) {
   var query = {_id:id}
   var update = {
     hcTerm: updateData.hcTerm
   }
   const data = await hmTerms.findOneAndUpdate(query, update );
   callback(null,data)
};

// update examtype status
module.exports.updateTermStatus = async function (id , updateData , field, callback) {
   var query = {_id:id}
   var update = {
     hcStatus: updateData.value
   }
   const data = await hmTerms.findOneAndUpdate(query, update );
    callback(null,data)
};

// Delete examtype
module.exports.removeTerm = async  (id, callback) => {
	var query = {_id: id};
	const data = await hmTerms.findOneAndDelete(query);
	 callback(null,data)
}
