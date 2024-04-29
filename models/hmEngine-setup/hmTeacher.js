var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

/*
   // hilmacs class Schema
*/

// User Schema (a table @ hilmacs db)
var teacherSchema = mongoose.Schema({
  hcUsername:{ type:String, required: true , index:true },
  hcPassword:{ type:String, required: true },
  hcFullnames:{ type:String, required: true },
  hcGender:{ type:String,default:'Male' },
  hcPhone:{ type:Number },
  hcAddress:{ type:String,default:'null' },
  hcUseRole:{ type:String, required: true },
  hcImgPath:{ type:String,default:"/img/defaults/user.jpg" },
  hcStatus:{ type:String, default: "offline" },
  hcState:{ type:Number, default:1 },
  hcSubjects:{type:Array,default:null},
  hcClasses:{type:Array,default:null},
  hcTType:{type:Number,default:1},
  hcDate:{ type:Date, default:Date.now }
});

const collectionName_Tea = 'hm_acc_teacher';
const hmTeacher = mongoose.model('hm_acc_teacher' , teacherSchema ,collectionName_Tea);

// Get get all teachers
module.exports.getTeacher = async (callback,limit) => {
   const data = await hmTeacher.find({}).sort({hcDate: -1}).limit(limit);
   callback(null,data)
};

// get teacher by id
module.exports.getTeacherById = async (id , callback) => {
   const data = await hmTeacher.findById(id);
   callback(null,data)
};

// get teacher by id
module.exports.getTeacherByUname = async (name , callback) => {
  var query = {hcUsername:name}
  const datas = await hmTeacher.findOne(query).sort({hcDate: -1}).limit(5)
  if(!datas){
	  if(name === 'admin'){
		  const teacher = new hmTeacher()
		  teacher.hcUsername = name
		  teacher.hcUseRole = 'superuser'
		  teacher.hcFullnames = 'Admin Teacher'
		  teacher.hcPassword = '123456789'
		   bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(teacher.hcPassword, salt, async (err, hash) => {
			   teacher.hcPassword = hash ;
			   const data = await teacher.save();
			   callback(null,data)
			});
		  });
		 
	  }
  }
  callback(null,datas)
};


// add teacher
module.exports.addTeacher = (data , callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(data.hcPassword, salt, async (err, hash) => {
       data.hcPassword = hash ;
       const datas = await hmTeacher.create(data);
	   callback(null,datas)
    });
  });
};

// update teacher
module.exports.updateTeacherSate = async (id , update , options, callback)  => {
   var query = {_id:id};
   const data = await hmTeacher.findOneAndUpdate(query, update );
   callback(null,data)
};

//count registered teachers
module.exports.countTeacher = async function (callback) {
  var query = {};
  const data = await hmTeacher.find(query );
  callback(null,data.length)
};

// Deactivate teacher
module.exports.removeTeacher = async (id, callback) => {
	var query = {_id: id};
	const data = await hmTeacher.findOneAndDelete(query);
	callback(null,data)
}
