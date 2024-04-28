var mongoose = require('mongoose');

// hilmacs client Schema
var gardingSchema = mongoose.Schema({
  hcGClass:{ type:String,index:true },
  hcGName:{ type:String,defualt:null },
  hcGValue:{ type:String,defualt:null },
  hcGDate:{type:Number,default:2017 },
  hcDate:{ type:Date, default:Date.now }
});

const gradeName = 'hm_grading';
const hmGrading = mongoose.model('hm_grading' , gardingSchema ,gradeName);

// Get client grading
module.exports.getGrading = async function (callback,limit) {
   const data = await hmGrading.find({}).limit(limit).sort({hcDate: -1});
   callback(null,data)
};

// get one hilmacs client controls by role
module.exports.getGradByValue = async function (data , callback) {
   var query = {hcGName:data.name,hcGClass:data.class,hcGDate:data.year}
   const datas = await hmGrading.find(query).collation({locale:'en',strength: 2}).sort({hcGName:1});
   callback(null,datas)
};

// get one by class & year
module.exports.getGradeByName = async function (data , callback) {
   var query = {hcGClass:data.class,hcGDate:data.year}
   const datas = await hmGrading.find(query).collation({locale:'en',strength: 2}).sort({hcGName:1});
   callback(null,datas)
};

// get all by year
module.exports.getGradeByYear = async function (data , callback) {
   var query = {hcGDate:data.year}
   const datas = await hmGrading.find(query).sort({hcDate: -1});
   callback(null,datas)
};
// get one grade by id
module.exports.getGradeById = async (id , callback) => {
   const data = await hmGrading.findById(id);
   callback(null,data)
};

// add hilmacs client grades
module.exports.newGrading = async function (data , callback) {
  const datas = await  hmGrading.create(data);
  callback(null,datas)
};

// update hilmacs client grading
module.exports.updateGrade = async (id , update , callback)  => {
   var query = {_id:id};
   const data = await hmTeacher.findOneAndUpdate(query, update);
   callback(null,data)
};

// Delete grade
module.exports.removeGrade = async (id, callback) => {
	var query = {_id: id};
	hmGrading.remove(query, callback);
}

// hilmacs client Schema
var advGardingSchema = mongoose.Schema({
  hcGAName:{type:String,index:true},
  hcGAYear:{type:Number,default:2017},
  hcGAClass:{type:String,default:null},
  hcGAPaper:{type:String,default:null},
  hcGALeast:{type:String,default:null},
  hcGADate:{ type:Date,default:Date.now }
});

const advGradeName = 'hm_grading_adv';
const hmAvdGrading = mongoose.model('hm_grading_adv' , advGardingSchema ,advGradeName);


// Get client grading
module.exports.getAdvGrading = async function (callback,limit) {
   const data = await hmAvdGrading.find({}).limit(limit).collation({locale:'en',strength: 2}).sort({hcGAName:1});
	callback(null,data)
};

// get all
module.exports.getAdvGradeCheck = async function (data , callback) {
   var query = {hcGAName:data.name,hcGAYear:data.year,hcGAClass:data.class,hcGAPaper:data.paper}
   const datas = await hmAvdGrading.findOne(query,'hcGALeast').sort({hcDate: -1});
   callback(null,datas)
};

// get by paper
module.exports.getAdvGradeByName = async function (data , callback) {
   var query = {hcGAPaper:data.paper,hcGAYear:data.year,hcGAClass:data.class}
   const datas = await hmAvdGrading.findOne(query,'hcGALeast hcGAName').collation({locale:'en',strength: 2}).sort({hcGAName:1});
	callback(null,datas)
};

// get one grade by
module.exports.getAdvGradeByYearClass = async function (data , callback) {
   var query = {hcGAYear:data.year,hcGAClass:data.class}
   const datas = await hmAvdGrading.find(query,'hcGALeast hcGAName hcGAPaper _id').collation({locale:'en',strength: 2}).sort({hcGAName:1});
	callback(null,datas)
};

// add hilmacs client advanced grades
module.exports.newAdvGrading = async function (data , callback) {
   const datas = await hmAvdGrading.create(data);
   callback(null,datas)
};

// get one adv grade by id
module.exports.getAdvGradeByById = async function (id ) {
   const data = await hmAvdGrading.findById(id);
   callback(null,data)
};

//update advanced grading
module.exports.updateAdvGrade = async  (id , update , callback)  => {
   var query = {_id:id};
   const data = await hmTeacher.findOneAndUpdate(query, update );
   callback(null,data)
};

// Delete adv grade
module.exports.removeAdvGrade = async (id, callback) => {
	var query = {_id: id};
	const data = await  hmAvdGrading.findOneAndDelete(query);
	callback(null,data)
}
