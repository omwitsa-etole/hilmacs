var express       = require('express');
var router        = express.Router();
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const multer      = require('multer');
const path        = require('path');
const hmService   = new Object();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')

//set hilmacs disk storage room
hmService.imgStore = multer.diskStorage({
  destination : './public/uploads',
  filename    :  (req,file,cb) => {
    cb(null, file.fieldname + '-' + Date.now()  + path.extname(file.originalname));
  }
});

// init uploads
hmService.imgUpload = multer({
  storage:hmService.imgStore
}).single('SuperUser');


var User = require('../models/user');
var Student = require('../models/hmEngine-setup/hmStudent');

// Register
router.get('/register',function(req ,res) {
  res.render('register');
});

// Login
router.get('/login',function(req ,res) {
  res.render('login');
});

// Register SuperUser Process
router.post('/register',[
  // Validate fields using express-validator
  body('username','Name is required').notEmpty(),
  body('fullnames','Name is require').notEmpty(),
   body('password','Name is required').notEmpty(),
   body('password2','Name is required').notEmpty(),
], async (req ,res) => {
  var username  = req.body.username ;
  var fullnames = req.body.fullnames ;
  var password  = req.body.password ;
  var password2 = req.body.password2 ;
  var userrole  = req.body.role ;

	
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
	   console.log(errors)
      res.render('register',{
        errors:errors
      });
   } else {
	   if(password){
			const salt = await bcrypt.genSalt(10)
			password = await bcrypt.hash(password, salt)
		}
		const user = await User.findOne({hcUsername:username})
		if(user){
			req.flash('error_msg','User Already exists');

			return res.redirect('/users/login');
		}
       var newUser = new User({
           hcUsername:username,
           hcFullnames:fullnames,
           hcPassword:password,
           hcUseRole:userrole
       });
       
        newUser = await newUser.save();
		if(newUser._id) {
          console.log(newUser)
          hmService.imgUpload(req,res,(err) =>{
            if(err) throw err ;
            console.log(req.file);
          });
        }
       // throw feedback msg to user
       req.flash('success_msg','You are registered and can now login');

       // redirect new user to the hilmacs login page
       res.redirect('/users/login');
   }
});


// using passport to authenticate users@Hilmacs
// wibgates{dav} copied this->(code:57:77) from passport
// a copy of passport's license is attached
passport.use(new LocalStrategy(
  async function(hcUsername, hcPassword, done) {
	  console.log(hcUsername, hcPassword)
    const user = await User.findOne({hcUsername:hcUsername});
	if (!user) {
		return done(null,false ,{message: 'Unknown Hilmacs User'});
	  }
	if(user) {
      const isMatch = await bcrypt.compare(hcPassword, user.hcPassword)
       console.log(isMatch)
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null,false ,{message: 'Invalid Password'});
        }
      
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  const user = await User.findById(id);
  done(null,user);
});

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
	  console.log(req.user)
    req.flash('userFullnames', req.user.hcFullnames);
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/' + req.user.hcUseRole);
});

router.post('/student/register',[
  // Validate fields using express-validator
  body('username','Name is required').notEmpty(),
  body('fullnames','Name is require').notEmpty(),
   body('password','Name is required').notEmpty(),

], async (req ,res) => {
  var username  = req.body.username ;
  var fullnames = req.body.fullnames ;
  var password  = req.body.password ;
  var userrole  = req.body.role || "student" ;

	
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
	   return res.status(406).json({message: errors});
   } else {
	   if(password){
			const salt = await bcrypt.genSalt(10)
			password = await bcrypt.hash(password, salt)
		}
		const user = await Student.findOne({hcUsername:username})
		if(user){
			return res.status(403).json({message: 'User already Exists'});
		}
       var newUser = new Student({
           hcUsername:username,
           hcFullnames:fullnames,
           hcPassword:password,
           hcUseRole:userrole
       });
       
        newUser = await newUser.save();
		if(newUser) {
          console.log(newUser)
          hmService.imgUpload(req,res,(err) =>{
            if(err) throw err ;
            console.log(req.file);
          });
        }
		return res.status(200).json({ message:"Account Created Successfull, Login to continue" })
       
   }
});


router.post('/student/login', async function(req, res) {
	const {username,security} = req.body
	console.log(username,security)
	if(!username || !security){
		return res.status(403).json({message:"Anaouthourised"})
	}
	const user = await Student.findOne({hcUsername:username});
	if (!user) {
		return res.status(403).json({message: 'Unknown Student'});
	  }
	if(user) {
      const isMatch = await bcrypt.compare(security, user.hcPassword)
       console.log(isMatch)
        if (isMatch) {
          var payload = {
			user: {
			  id: user.id,
			},
		  };
		  jwt.sign(
			payload,
			config.jwtSecret,
			{
			  expiresIn: 360000,
			},
			(err, token) => {
			  if (err) throw err
			  
			  return res.status(200).json({ token: token,user:user,message:"Login Successfull" })
			},
		  )
        } else {
          return res.status(403).json({message: 'Invalid Password'});
        }
      
    }
});

router.get('/logout', function(req , res) {
  req.logout(function(e){
	  req.flash('success_msg','You are logged out');

		res.redirect('/users/login');
  });

  

});


module.exports = router;
