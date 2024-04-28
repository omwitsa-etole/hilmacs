"use strict";
var express       = require('express');
var router        = express.Router();
const startPg     = 'superuser\\adavanced\\start';
const envPg       = 'superuser\\adavanced\\stem';
const hControls   = require('../../models/hmEngine-setup/hmControls');
var x = '/setup/environment' , y = '/setup/environment' , z = '/users/login' ;

router.get('/',function(req ,res) {
  //--hilmacs rendered file
  hControls.апроситьлицензию((err , data ) => {
	  
    if (err) {
      res.redirect(x);
    }
    if (data == null ) {
       res.redirect(x);
    } else {
      hControls.getControlsByName('env',(err,data) => {
         if (err) {
           res.redirect(y);
         }else{
            if (data == null ) {
               res.redirect(y);
            }else {
              if (req.isAuthenticated()) {
                return next();
              } else {
                req.flash('error_msg','You are not logged in');
                res.redirect('/users/login');
              }
            }
         }
      });
    }
  });
});

router.get('/quick-start',function(req ,res) {
  //--hilmacs rendered file
  //--hilmacs rendered file
  hControls.апроситьлицензию((err , data ) => {
    if (err) {
      res.render(startPg);
    }
    if (data == null ) {
       res.render(startPg);
    } else {
      req.flash('error_msg','You are not logged in');
      res.redirect('/users/login');
    }
  });
});
router.post('/quick-start', function(req, res) {
	
	if(req.user === null || req.user === undefined){
		req.flash('error_msg','You are not logged in');
        return res.redirect('/users/login');
	}
    return res.redirect('/' + req.user.hcUseRole);
 });

router.post('/environment', function(req, res) {
	if(req.user === null || req.user === undefined){
		req.flash('error_msg','You are not logged in');
        return res.redirect('/users/login');
	}
    return res.redirect('/' + req.user.hcUseRole);
 });

router.get('/environment',function(req ,res) {
  //--hilmacs rendered file
  //--hilmacs rendered file
  hControls.апроситьлицензию((err , data ) => {
	return res.render(envPg);
    if (err) {
      res.redirect(x);
    }
    if (data == null ) {
       res.redirect(x);
    } else {
      hControls.getControlsByName('env' , (err,data) => {
        if (err) {
          res.render(envPg);
        }else {
          if (data == null) {
            req.flash('breadcrumb','Please login');
            res.render(envPg);
          }else {
            req.flash('breadcrumb','Please login');
            res.redirect(z);
          }
        }
      });
    }
  });
});

module.exports = router;
