/*                                                   ###########
////////////////////////////////////////////////////////  ||   ////////////////////////////////////////////////////////
/////  --hilmacs.js  {jetpowered}                    ///  ||   /////  --dev for : Hilmacs System                    ///
/////  --CopyRight : Wibgates Kenneth 2017           ///  ||   /////  --Version : Hilmacs Node.js V10               ///
/////  --Email     : wibgates@wibgates.com           ///  ||   /////  --Site    : www.hilmacs.com                   ///
/////  --twitter   : @wifigates                      ///  ||   /////  --Git.Rep : @wibgates                         ///
////////////////////////////////////////////////////////  ||   ////////////////////////////////////////////////////////
												                              ##########                                                    */
"use strict";
function hcr(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
}

$(document).ready( () => {
	// show current year
	hmService.html('.hm-sv-c-year',parseInt(hmService.mtime.now('y')));

	// hilmacs display terms {hm-ctrl-1:exams}
	hmService.hapiTerms =  () => {
		$.getJSON(hmPath.gate('terms',null,'data/'),  (data) => {
		   //$(".eml").empty() // clear all HTML in the div before we start printing chat messages
		 if (jQuery.isEmptyObject(data)) {
	 			 //console.log('yes');
	 		}else{
	 			$('.hm-mv-terms').empty();
	 			$.each(data,  (key, val) => {
					   $('.hm-sv-terms').append(`<option value="${val._id}">${val.hcTerm}</option>`);
	 				   if (val.hcStatus == 0 ) { var state = "Closed"; } else { var state = "Open"; }
	 						$('.hm-mv-terms').append('<tr class="'+val._id+'_off" ><td>'+val.hcTerm+'</td> <td>'+state+'</td> <td class="no-print" ><a  onclick="hmService.del(\''+val._id+'\' , \'terms\' );" md-ink-ripple="" class="md-btn md-raised pull-left p-h-md red '+val._id+'_btn">Delete</a></td></tr>');
	 			 });
	 		}
		});
	}
  // dispaly supported terms
	hmService.hapiTerms();

	// hilmacs display accounts-admin
	hmService.hapiAccAdmin =  () => {
		$.getJSON(hmPath.gate('admin',null,'data/'),  (data) => {
		   //$(".eml").empty() // clear all HTML in the div before we start printing chat messages
		 if (jQuery.isEmptyObject(data)) {
	 			 //console.log('yes');
				 $('.hm-sv-accounts-admin').append(`<option value="0">No accounts</option>`);
	 		}else{
	 			$('.hm-mv-accounts-v-port').empty();
	 			$.each(data,  (key, val) => {
					   $('.hm-sv-accounts-admin').append(`<option value="${val._id}">${val.hcFullnames}</option>`);
	 				   if (val.hcState == 1 ) { var state = "Active" , color='primary'; } else { var state = "In Active" , color='primary'; }
	 						$('.hm-mv-accounts-v-port').append(`<tr class="${val._id}_off ucwords" ><td>${val.hcUsername}</td> <td>${val.hcFullnames}</td> <td class="b">${val.hcUseRole}</td> <td class="text-${color} state-${val._id}">${state}</td> <td>${val.hcDate}</td> <td class="no-print text-center" ><button class="btn btn-icon btn-sm btn-rounded btn-danger btn-${val._id}" onclick="hmService.chgState(\'${val._id}\' , \'admin\' , ${val.hcState} );"><i class="mdi-action-lock hm-acc-state-${val._id}"></i></button></td></tr>`);
	 			 });
	 		}
		});
	}
  // dispaly admin accounts
	hmService.hapiAccAdmin();

	// hilmacs display accounts-teacher
	hmService.hapiAccTeacher =  () => {
		$.getJSON(hmPath.gate('teachers',null,'data/'),  (data) => {
		   //$(".eml").empty() // clear all HTML in the div before we start printing chat messages
		 if (jQuery.isEmptyObject(data)) {
	 			 //console.log('yes');
				 $('.hm-sv-accounts-teachers').append(`<option value="0">No accounts</option>`);
	 		}else{
	 			$.each(data,  (key, val) => {
					   $('.hm-sv-accounts-teachers').append(`<option value="${val._id}">${val.hcFullnames}</option>`);
	 				   if (val.hcState == 1 ) { var state = "Active" , color='primary'; } else { var state = "In Active" , color='primary'; }
	 					 $('.hm-mv-accounts-v-port').append(`<tr class="${val._id}_off ucwords" ><td>${val.hcUsername}</td> <td>${val.hcFullnames}</td> <td class="b">Teacher</td> <td class="text-${color} state-${val._id}">${state}</td> <td>${val.hcDate}</td> <td class="no-print text-center" ><button class="btn btn-icon btn-sm btn-rounded btn-danger btn-${val._id}" onclick="hmService.chgState(\'${val._id}\' , \'teachers\' , ${val.hcState}  );"><i class="mdi-action-lock hm-acc-state-${val._id}"></i></button></td></tr>`);
	 			 });
	 		}
		});
	}
  // dispaly teachers accounts
	hmService.hapiAccTeacher();

	// hilmacs default comment
	$( ".hm-invoke-t1" ).click( () => {
	   // hilmacs default comment
	   hmService.hapiTerms();
	});

	var fetched_subjects = [];

	// hilmacs default comment
	

	// hilmacs display classes types
	hmService.hapiSubjects =  () => {
		$('#available-units').change(function(e){
			var value = e.target.value.split("+")
			console.log("selected",e.target.value,value);
			var selected = $("#selected-units").val()
			
			var selectedids = $('#hm-inpt-modal-c2').val();
			if(selected.includes(value[1])){
				selected.replace(value[1]+",","")
				selectedids.replace(value[0]+",","")
				$('#hm-inpt-modal-c2').val(selectedids);
				$("#selected-units").val(selected)
			}else{
				selected += value[1]+","
				selectedids+= value[0]+","
				$('#hm-inpt-modal-c2').val(selectedids);
				$("#selected-units").val(selected)
			}
			e.target.value = null
			let str = $('#hm-inpt-modal-c2').val()
			let lastIndex = str.lastIndexOf(',');
			if (lastIndex !== -1) {
				let modifiedStr = str.substring(0, lastIndex) + str.substring(lastIndex + 1);
				$('#hm-inpt-modal-c2').val(modifiedStr)
				// console.log(modifiedStr);
			}else{
				$('#hm-inpt-modal-c2').val(str+",")
			}
		});
		$.getJSON(hmPath.gate('subjects',null,'data/'),  (data) => {
			if (jQuery.isEmptyObject(data)) {
				 //console.log('yes');
			}else{
				$('.hm-mv-subjects').empty();
				//$('#available-units').empty();
				$.each(data,  (key, val) => {
						fetched_subjects.push({id:val._id,name:val.hcName})
					   if (val.hcStatus == 0 ) { var state = "Closed"; } else { var state = "Open"; }
						 $('.hm-sv-subjects').append(`<option value="${val._id}" >${val.hcName}</option>`);
						 $('#available-units').append(`<option value="${val._id}+${val.hcName}" name="${val.hcName}">${val.hcName}</option>`);
						 $('.hm-mv-subjects').append( `<tr class="${val._id}_off"> <td class="ng-binding">${val.hcName}</td> <td class="ng-binding"><span class="btn btn-default btn-sm" onclick="hm_v_s_units('${val.hcUnit}' , '${val.hcName}' , 'usubjects');">View unit<small>(s)</small></span></td> <td class="ng-binding">${val.hcDate}</td><td class="no-print"  onclick="hmService.del(\'${val._id}\' , \'subjects\');"><a  md-ink-ripple="" class="md-btn md-raised pull-left p-h-md red ${val._id}_btn">Delete</a></td></tr>`);
				 });
			}
		});
	}
	
	
  // dispaly supported terms
	hmService.hapiSubjects();
	
	
	$( ".hm-invoke-e1" ).click( () => {
	   // hilmacs default comment
	   hmService.hapiExams();
	});
	
	hmService.Students =  () => {
		$.getJSON(hmPath.gate('students',null,'data/'),  (data) => {
		   //$(".eml").empty() // clear all HTML in the div before we start printing chat messages
		 if (jQuery.isEmptyObject(data)) {
	 			 //console.log('yes');
				 $('.hm-sv-accounts-teachers').append(`<option value="0">No accounts</option>`);
	 		}else{
				$('.classuser-count').text(data.length)
	 			$.each(data,  (key, val) => {
					   $('.hm-sv-accounts-teachers').append(`<option value="${val._id}">${val.hcFullnames}</option>`);
	 				   if (val.hcState == 1 ) { var state = "Active" , color='primary'; } else { var state = "In Active" , color='primary'; }
	 					 $('.hm-mv-accounts-v-port').append(`<tr class="${val._id}_off ucwords" ><td>${val.hcUsername}</td> <td>${val.hcFullnames}</td> <td class="b">Teacher</td> <td class="text-${color} state-${val._id}">${state}</td> <td>${val.hcDate}</td> <td class="no-print text-center" ><button class="btn btn-icon btn-sm btn-rounded btn-danger btn-${val._id}" onclick="hmService.chgState(\'${val._id}\' , \'teachers\' , ${val.hcState}  );"><i class="mdi-action-lock hm-acc-state-${val._id}"></i></button></td></tr>`);
	 			 });
	 		}
		});
	}
  // dispaly teachers accounts
	hmService.Students();

	hmService.editQuestion = (id)=> {
		if(id){
			$.getJSON(hmPath.gate('questions',null,'data/'+id),  (data) => {
				console.log("question=>",data)
				//$(".eml").empty() // clear all HTML in the div before we start printing chat messages
				if (jQuery.isEmptyObject(data)) {
					 //console.log('yes');
				}else{
					$('.question-types').val(data.type)
					$('.question-category').val(data.category)
					$('.question-value').val(data.value)
					$('.question-input').val(data.question)
					$('.question-answer').val(data.answer)
					$('.question-id').val(data._id)
					hmService.previewQuestion(data)
				}
			});
		}
	}

	$('.red').click(function(e){
		$('.question-id').val('')
	})

	hmService.hapiQuestions =  () => {
		let url = window.location.href
		let exams = url.split("/")[url.split("/").length-2]
		url = url.split("/")[url.split("/").length-1]
		$.getJSON(hmPath.gate('questions',null,'data/'),  (data) => {
			console.log("questions=>",data)
			//$(".eml").empty() // clear all HTML in the div before we start printing chat messages
			if (jQuery.isEmptyObject(data)) {
				 //console.log('yes');
			}else{
				console.log("questions=>",data)
 		    $('.hm-mv-questions').empty();

				$.each(data,  (key, val) => {
					if (val.hcStatus == 0 ) { var state = "Closed"; } else { var state = "Open"; }
					
					if(exams.includes('exams') && val.exam.includes(url)){
						$('.hm-mv-questions').append('<tr  class="'+val._id+'_off" ><td><a href="?question='+val._id+'">'+val.question+'</a></td> <td>'+val.value+'</td><td class="no-print"  onclick="hmService.del(\''+val._id+'\' , \'questions\');"><a  md-ink-ripple="" class="md-btn md-raised pull-left p-h-md red '+val._id+'_btn">Delete</a></td><td><a href="javascript:void(0)" data-toggle="modal" data-target="#hm-modal-g1" onclick="hmService.editQuestion(\''+val._id+'\')">Edit</a></td></tr>');
					}else{
						$('.hm-mv-questions').append('<tr  class="'+val._id+'_off" ><td><a href="?question='+val._id+'">'+val.question+'</a></td> <td>'+val.value+'</td><td class="no-print"  onclick="hmService.del(\''+val._id+'\' , \'questions\');"><a  md-ink-ripple="" class="md-btn md-raised pull-left p-h-md red '+val._id+'_btn">Delete</a></td><td><a href="javascript:void(0)" data-toggle="modal" data-target="#hm-modal-g1" onclick="hmService.editQuestion(\''+val._id+'\')">Edit</a></td></tr>');
					}
					$('.hm-sv-questions').append(`<option value="${val._id}">${val.hcExam}</option>`);
					   
				 });
			}
		});
	}
  // dispaly supported terms
	hmService.hapiQuestions();
	
	hmService.hapiExams =  () => {
		let url = window.location.href
		let exams = url.split("/")[url.split("/").length-2]
		url = url.split("/")[url.split("/").length-1]
		$.getJSON(hmPath.gate('exams',null,'data/'),  (data) => {
			//$(".eml").empty() // clear all HTML in the div before we start printing chat messages
			if (jQuery.isEmptyObject(data)) {
				 //console.log('yes');
			}else{
				$('.total-exams').text(data.length + "Exams ")
 		    $('.hm-mv-exams').empty();
				$.each(data,  (key, val) => {
					if(exams.includes('exams') && url.length > 6){
						console.log("exams",url,exams)
						if(url === val._id.toString()){
							$('.question-exam').val(val._id)
						}
					}
					  $('.hm-sv-exams').append(`<option value="${val._id}">${val.hcAbbr}</option>`);
					   if (val.hcStatus == 0 ) { var state = "Closed"; } else { var state = "Open"; }
						$('.hm-mv-exams').append('<tr  class="'+val._id+'_off" ><td><a href="/settings/exams/'+val._id+'">'+val.hcExam+'</a></td> <td>'+val.hcStreams+'</td> <td>'+val.hcAbbr+'</td> <td><label class=""> <a href="/settings/exams/'+val._id+'">Detail</a></label></td><td class="no-print"  onclick="hmService.del(\''+val._id+'\' , \'exams\');"><a  md-ink-ripple="" class="md-btn md-raised pull-left p-h-md red '+val._id+'_btn">Delete</a></td></tr>');
				 });
			}
		});
	}
  // dispaly supported terms
	hmService.hapiExams();
	

	// hilmacs display classes types
	hmService.hapiClasses =  () => {
		$.getJSON(hmPath.gate('classes',null,'data/'),  (data) => {
			if (jQuery.isEmptyObject(data)) {
			}else{
				console.log("subjects",fetched_subjects)
				let topClass = null
				for(var cl of data){
					if(topClass && cl.users.length > topClass.users.length ){
						topClass = cl
					}
					if(!topClass){topClass = cl}
				}
				console.log("topClass=>",topClass)
				$('.top-class').text(topClass ? topClass.hcName : "No Classes")
				$.each(data,  (key, val) => {
					   for(var dt of fetched_subjects){
						   if(dt.id){
							   val.hcStreams = val.hcStreams.replace(dt.id,dt.name)
						   }
					   }
					   if (val.hcStatus == 0 ) { var state = "Closed"; } else { var state = "Open"; }
						 $('.hm-sv-classes').append(`<option value="${val._id}">${val.hcName}</option>`);
						 $('.hm-mv-classes').append( `<tr class="${val._id}_off"> <td class="ng-binding">${val.hcName}</td> <td class="ng-binding no-print"><span class="btn btn-default btn-sm" onclick="hm_v_s_units('${val.hcStreams}' , '${val.hcName}' , 'uclasses');">View unit<small>(s)</small></span></td> <td class="ng-binding">${val.hcDate}</td><td class="no-print"  onclick="hmService.del(\'${val._id}\' , \'classes\');"><a  md-ink-ripple="" class="md-btn md-raised pull-left p-h-md red ${val._id}_btn">Delete</a></td></tr>`);
				 });
			}
		});
	}
  // dispaly supported terms
	hmService.hapiClasses();

	// hilmacs display classes types
	hmService.hapiDorms =  () => {
		$.getJSON(hmPath.gate('dorms',null,'data/'),  (data) => {
			if (jQuery.isEmptyObject(data)) {
				 //console.log('yes');
			}else{
				$('.hm-mv-dorms').empty();
				$.each(data,  (key, val) => {
					   $('.hm-sv-dorms').append(`<option value="${val._id}">${val.hcDormName}</option>`);
					   if (val.hcStatus == 0 ) { var state = "Closed"; } else { var state = "Open"; }
						$('.hm-mv-dorms').append( `<tr class="${val._id}_off"> <td class="ng-binding">${val.hcDormName}</td> <td class="ng-binding">${val.hcCaptain}</td> <td class="ng-binding">${val.hcAsstCaptain}</td><td class="ng-binding">${val.hcWarden}</td><td class="ng-binding">${val.hcBeds}</td><td class="no-print" onclick="hmService.del(\'${val._id}\' , \'dorms\');"><a  md-ink-ripple="" class="md-btn md-raised pull-left p-h-md red ${val._id}_btn">Delete</a></td></tr>`);
				 });
			}
		});
	}
  // dispaly supported terms
	hmService.hapiDorms();

	// hilmacs default comment
	$( ".hm-invoke-c1" ).click( () => {
		
	});

	// view stream in options
	// t9 -12 , 13-16
	hmService.streamMatch = (x,y) => {
	  if (x && x !== 0 ) {
			$.getJSON(hmPath.gate('classes',null,'data/'+x) , (data) => {
				
				if (hmService.isEmptyObject(data)) {
					$('.'+y).empty();
					var streams = data.hcStreams.split(',');
					if (streams == null || streams == '') {
						 $('.'+y).append(`<option value="0">No Streams</option>`);
					}else{
						$.each(streams,  (key, val) => {
							$('.'+y).append(`<option value="${val}">${val}</option>`);
					 });
					 $('.'+y).append(`<option value="1">All Streams</option>`);
					}
				}
			});
		}
	}

	hmService.subjectMatch = (x,y) => {
	  if (x && x !== 0 ) {
			$.getJSON(hmPath.gate('subjects',null,'data/'+x) , (data) => {
				if (hmService.isEmptyObject(data)) {
					$('.'+y).empty();
					var units = data.hcUnit.split(',');
					if (units == null || units == '') {
						 $('.'+y).append(`<option value="0">No Unit Papers</option>`);
					}else{
						$.each(units,  (key, val) => {
							$('.'+y).append(`<option value="${val}">${val}</option>`);
					 });
					 $('.'+y).append(`<option value="1">All Paper Units</option>`);
					}
				}
			});
		}
	}

	// hilmacs default comment
	hmService.onChange = (x,y,i) => {
	 $( '.'+x ).change( () => {
			 var z = $('.'+x).val() ;
			 // hilmacs default comment
			 if (i == 'stream') {
				 if (z == 0 || z == '0' ) {
					 $('.'+y).empty();
					 $('.'+y).append(`<option value="0">Choose Stream</option>`);
				 }else {
					 hmService.streamMatch(z,y);
				 }
			 } else if (i == 'subject') {
				 if (z == 0 || z == '0' ) {
					 $('.'+y).empty();
					 $('.'+y).append(`<option value="0">Choose Unit </option>`);
				 }else {
					 hmService.subjectMatch(z,y);
				 }
			 }
	 });
	}

   // avail dynamic options
	 hmService.onChange('hm-inpt-t-9' ,'hm-inpt-t-13','stream');
	 hmService.onChange('hm-inpt-t-10' ,'hm-inpt-t-14','stream');
	 hmService.onChange('hm-inpt-t-11' ,'hm-inpt-t-15','stream');
	 hmService.onChange('hm-inpt-t-12' ,'hm-inpt-t-16','stream');

	 hmService.onChange('hm-inpt-t-17' ,'hm-inpt-t-00-1','subject');
	 hmService.onChange('hm-inpt-t-18' ,'hm-inpt-t-00-2','subject');
	 hmService.onChange('hm-inpt-t-19' ,'hm-inpt-t-00-3','subject');
	 hmService.onChange('hm-inpt-t-20' ,'hm-inpt-t-00-4','subject');

   //change language
	 $( ".hm-la-1" ).click(() => {
	     // hilmacs default comment
	     var x = hmService.val('.hm-la-0');
			 $.post(hmPath.gate('controls',null,'data/'), { 'name' : 'language' , 'val':x} , (data) => {
				 hmService.hcwr('localize' , x , 360 );
			   hmService.redirect('',null);
			 });
	 });

	 //change country
	 $( ".hm-la-2" ).click(() => {
	     // hilmacs default comment
	     var x = hmService.val('.hm-la-01');
			 $.post(hmPath.gate('controls',null,'data/'), { 'name' : 'country' , 'val':x} , (data) => {
			   hmService.hcwr('region' , x , 360 );
				 hmService.html('.hm-sys-region',hmService.abbr.country[x]);
				 $('#hm-modal-s5').modal('hide');
				 $('#alert-w--chg-grade').modal('show');
			 });
	 });



});

/**
 * hilmacs grading structure
*/
$.getScript('/js/models/hmModal-grading.js');

// view stream in dialogs
function hm_v_s_units(x,y,z) {
	console.log(x,y,z)
  var dx ;
	$('.hm-mv-'+z+'').empty();
	dx = x.split(',');
	if (dx === null || dx === '') {
		 $('.hm-srch-str-units').hide('slow');
		 $('.hm-mv-'+z+'').append(`<tr><td>${y}</td><td>Main</td></tr>`);
	}else{
		$('.hm-srch-str-units').show('slow');
		$.each(dx,  (key, val) => {
			if(val === ''){return true}
			$('.hm-mv-'+z+'').append(`<tr><td>${val}</td><td><span class="btn btn-default  btn-sm"><i class="mdi-action-delete text-danger text-md "></i></span></td></tr>`);
	 });
	}
	$('.hm-modal-edit-'+z+'-hd').html(y);
	$('.hm-modal-edit-'+z+'').modal('show');
}


// REMOVE DATA FROM ANY HILMACS DOCUMENT
hmService.del = (a,b) => {
	// hilmacs default comment
	$.delete(hmPath.gate(b,null,'data/'+a)).always( () => {
     $('.'+a+'_btn').removeClass('red');
		 $('.'+a+'_btn').addClass('yellow');
		 $('.'+a+'_btn').html(hcr('loaderIcon_sm')+' Discarding');
	}).done( () => {
		// control view
		$('.'+a+'_off').hide(2000);
	}).fail( () => {
		alert('Account Deletion failed');
	});
}


//CHANGE ACCOUNT State
hmService.chgState = (a,b,c) => {
		// hilmacs default comment
	 $.get(hmPath.gate(b,null,'update/'), {'id':a , 'val':c}).always( () => {
			 if (c == 1 ) {
				 $('.btn-'+a).removeClass('btn-danger');
				 $('.btn-'+a).addClass('btn-info');
	 			 $('.hm-acc-state-'+a).removeClass('mdi-action-lock');
	 			 $('.hm-acc-state-'+a).addClass('mdi-action-lock-open');
	       hmService.html('.state-'+a,'In active');
			 } else {
			   $('.btn-'+a).addClass('btn-danger');
				 $('.btn-'+a).removeClass('btn-info');
				 hmService.html('.state-'+a,'Active');
			 }
	 }).fail( () => {
		 console.log('failed Deactivating...');
	 });
}
