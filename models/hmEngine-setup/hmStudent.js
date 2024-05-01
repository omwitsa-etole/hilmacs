var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// User Schema (a table @ hilmacs db)
var userSchema = mongoose.Schema({
  hcUsername:{ type:String, required: true , index:true },
  hcPassword:{ type:String, required: true },
  hcFullnames:{ type:String, required: true },
  hcGender:{ type:String,defualt:"Change"},
  hcPhone:{ type:String },
  hcPosition:{ type:String },
  hcUseRole:{ type:String, required: true,default:"student" },
  hcImgPath:{ type:String,default:"/img/defaults/user.jpg" },
  hcStatus:{ type:String, default: "offline" },
  hcState:{ type:String, default:1},
  courses:{ type:Array, default:[]},
  subjects:{ type:Array, default:[]},
  hcDate:{ type:Date, default:Date.now }
});

var collectionName = 'hm_acc_student';
var User = module.exports = mongoose.model('hm_acc_student',userSchema,collectionName);

// create new superuser
module.exports.createUser =  async function(newUser, callback) {
    const data = await newUser.save();

}

// create new student
module.exports.newUser =  function(admin, callback) {
   bcrypt.genSalt(10, function(err, salt) {
     bcrypt.hash(admin.hcPassword, salt,async function(err, hash) {
        admin.hcPassword = hash ;
		admin.hcUseRole = "student"
        const data = await User.create(admin);
		callback(null,data)
     });
   });
}

//check if role exist
module.exports.checkRoleExits = async function (role , callback) {
   var query = {hcUseRole:role} ;
   const data = await User.find(query).limit(1);
   callback(null,data)
};

//count registered users
module.exports.countUser = async function (callback) {
  var query = {};
  const data = await User.find(query);
  callback(null,data.length)
};

module.exports.getUser = async function (callback,limit) {
   const data = await User.find().limit(limit);
   callback(null,data)
};

// get only one admin string
module.exports.getUserById = async function (hc_user_id , callback) {
   const data = await User.findById(hc_user_id);
   callback(null,data)
};

// update admin
module.exports.updateUserSate =  async (id , update , options, callback)  => {
   var query = {_id:id};
   const data = await User.findByIdAndUpdate(id, update,{new:true} );
};

// update hilmacs admin
module.exports.updateUser = async function (id , updateData , options, callback) {
   var query = {_id:id}
   var update = {
     hcUsername:updateData.hcUsername,
     hcPassword:updateData.hcPassword,
     hcFullnames:updateData.hcFullnames,
     hcGender:updateData.hcGender,
     hcPhone:updateData.hcPhone,
     hcPosition:updateData.hcPosition,
     hcUseRole:updateData.hcUseRole,
     hcImgPath:updateData.hcImgPath,
	 courses:updateData.courses,
	 subjects:updateData.subjects,
   }
   const data = await User.findOneAndUpdate(query, update,{new:true});
   callback(null,data)
};

module.exports.addSubject = async function(id,userid,callback){
	var query = {_id:userid}
	const user = await User.findOne(query)
	user.subjects.push(id)
	const data = await user.save()
	callback(null,data)
}

module.exports.addClass = async function(id,userid,callback){
	var query = {_id:userid}
	const user = await User.findOne(query)
	user.courses.push(id)
	const data = await user.save()
	callback(null,data)
}


module.exports.getUserByUsername = async function(username, callback) {
  var query = {hcUsername:username};
  const data = await User.findOne(query);
  callback(null,data)
}

module.exports.getUserById = async function(id, callback) {
  const data = await User.findById(id);
  callback(null,data)
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
     if (err) throw err ;
     callback(null ,isMatch);
  });
}


module.exports.dynamicPath = function(username, callback) {
  //return 'pot' ;
}

module.exports.getUserFullnames = async function (username , callback) {
  var query = {hcUsername:username};
  const data = await User.findOne(query).fullnames;
  callback(null,data)
};

// Delete user
module.exports.removeUser = async (id, callback) => {
	var query = {_id: id};
	const data = await User.findByIdAndDelete(query);
	callback(null,data)
}
