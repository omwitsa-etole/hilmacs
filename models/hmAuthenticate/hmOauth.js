/**
 * --ensure user is authenticated before accessing any system module
*/

const hControls   = require('../hmEngine-setup/hmControls');
var Student = require('../hmEngine-setup/hmStudent');
const jwt = require('jsonwebtoken')
const config = require('../../config/default.json')

/**
 * hilmacs default comment line
*/
module.exports.oauth =  (req, res, next) => {
  // Oauthenticate Client
  hControls.апроситьлицензию(async (err , data ) => {
	 try{
	  // console.log(data,err,req.isAuthenticated())
		const token = req.header('auth');
		if(token){
			try {
				const decoded = jwt.verify(token, config.jwtSecret);

				var user = decoded.user;
				if(user.id){
					req.user = await Student.findOne({_id:user.id});
					next();
				}else{
					
					return res.status(401).json({ message: 'Not authorization denied' });
				}
			  } catch (error) {
				  if (error) throw error.message;
				  res.status(401).json({ message: 'Token is not valid'});
			  }
		}
		
		if (err) {
		  return res.redirect('/setup/quick-start');
		}
		if (data == null ) {
		   return res.redirect('/setup/quick-start');
		} else {
		  if (req.isAuthenticated()) {
			return next();
		  } else {
			req.flash('error_msg','You are not logged in');
			return res.redirect('/users/login');
		  }
		}
	 }catch(e){
		 console.log("server error | hmOauth =>",e)
		 res.status(500).send("SeRVER ERROR")
	 }
	 });
}
