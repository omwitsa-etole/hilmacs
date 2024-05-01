var mongoose = require('mongoose');

// hilmacs subjectsSchema
var questionsSchema = mongoose.Schema({
   name:{ type:String, required: true, default:'none' },
   exam:{type:String,default:null},
   subjects:{type:Array,default:[]},
   answer:{type:String,required:true},
   answers:{type:Array,default:[]},
   type:{type:String},
   question:{type:String,required:true},
   category:{type:String},
   value:{type:String},
   hcDate:{ type:Date, default:Date.now }
 });
 
 var collectionName_Question = 'hm_structures_questions';
 var hmQuestion = mongoose.model('hm_structures_questions' , questionsSchema ,collectionName_Question);
 
 // Get get all subjects offered
 module.exports.getQuestions =  async (callback,limit,teacher)  => {
    let datas = []
    const data = await hmQuestion.find().sort({hcDate: -1}).limit(limit);
    for(var d of data){
       
       datas.push(d)
    }
    callback(null,datas)
 };
 
 // get one subject by id
 module.exports.getQuestionById = async  (id , callback)  => {
    const data = await  hmQuestion.findById(id);
    callback(null,data)
 };
 
 // add subject offered
 module.exports.addQuestion = async (newSubject , callback)  => {
    if(newSubject.question){
       
       const data = await hmQuestion.create(newSubject);
       callback(null,data)
    }
 };
 module.exports.newSubject = async (id,newData , callback)  => {
	var query = {_id:id}
	if(newData._id){
		const question = await hmQuestion.findOne(query)
	   var update = {
		 subjects: question.subjects.push(newData._id)
	   }
	   const data =  await hmQuestion.findOneAndUpdate(query, update );
	   callback(null,data)
	}
};

module.exports.updateAnswers =  async (id , update, options, callback)  => {
   var query = {_id:id}
   
   const data = await hmQuestion.findOneAndUpdate(query, update );
   callback(null,data)
};

module.exports.updateQuestion=  async (id , updateData , options, callback)  => {
   var query = {_id:id}
   var update = {
     answer:updateData.answer,
     question:updateData.question,
     value:updateData.value,
     
   }
   const data = await hmQuestion.findOneAndUpdate(query, update );
   callback(null,data)
};

module.exports.removeQuestion = async (id, callback) => {
	var query = {_id: id};
	const data = await hmQuestion.findOneAndDelete(query);
	callback(null,data)
}

// hilmacs classSchema
var classesSchema = mongoose.Schema({
  hcName:{ type:String, required: true, default:'none' },
  desc:{ type:String,default:'Join this class to gain knowledge about each and all aspects that are available ' },
  hcStreams:{ type:String, default:'none' },
  duration:{ type:String, default:'3 hours' },
  level:{ type:String, default:'Beginner' },
  teacher:{type:String,default:'admin'},
  hcDate:{ type:Date, default:Date.now },
  users:{ type:Array, default:[]},
  instructors:{ type:Array, default:[]},
  subjects:{type:Array, default:[]}
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

module.exports.newUser = async (id,newData , callback)  => {
	var query = {_id:id}
	if(newData){
		const classs = await hmClasses.findOne(query)
	   var update = {
		 users: classs.users.push(newData)
	   }
	   const data =  await hmSubjects.findOneAndUpdate(query, update );
	   callback(null,data)
	}
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
  hcName:{ type:String, required: true, default:'none' },
  teacher:{type:String,default:null},
  desc:{type:String,default:null},
  hcUnit:{ type:String, default:'none' },
  users:{ type:Array, default:[]},
  instructors:{ type:Array, default:[]},
  hcDate:{ type:Date, default:Date.now }
});

var collectionName_Subject = 'hm_structures_subjects';
var hmSubjects = mongoose.model('hm_structures_subjects' , subjectsSchema ,collectionName_Subject);

// Get get all subjects offered
module.exports.getSubjects =  async (callback,limit,teacher)  => {
	let datas = []
   const data = await hmSubjects.find().sort({hcDate: -1}).limit(limit);
   for(var d of data){
	   if(!d.teacher){
		   d.teacher = teacher
	   }
	   datas.push(d)
   }
   callback(null,datas)
};

// get one subject by id
module.exports.getSubjectById = async  (id , callback)  => {
	id = id.replace(/"/g, '');
   const data = await  hmSubjects.findOne({_id:id});
   callback(null,data)
};

// add subject offered
module.exports.addSubject = async (newSubject , callback)  => {
	if(newSubject.hcName){
		
	   const data = await hmSubjects.create(newSubject);
	   callback(null,data)
	}
};

module.exports.subjectUser = async (id,newData , callback)  => {
	id = id.replace(/"/g, '');
	var query = {_id:id}
	if(newData){
		const subject = await hmSubjects.findOne(query)
	   var update = {
		 users: subject.users.push(newData)
	   }
	   const data =  await hmSubjects.findOneAndUpdate(query, update );
	   callback(null,data)
	}
};

// update class
module.exports.updateSubject =async (id , updateData , options, callback)  => {
	id = id.replace(/"/g, '');
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
  hcCaptain:{ type:String, default:'admin' },
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
