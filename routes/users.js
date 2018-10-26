var express = require('express')
var app = express()
var session = require('express-session');
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM custData ORDER BY Contact_ID DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: 'User List', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('user/list', {
					title: 'User List', 
					data: rows
					
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	
	res.render('user/add', {
		title: 'Add New User',
		Contact_ID:'',
		Contact_Name: '',
		Contact_Designation: '',
		Contact_Email: '',
		Contact_Mobile: '',
		Contact_Reporting: '',
		Contact_Location : '',
		Contact_Project: '',
		Contact_Working1 : '',
		Contact_Working2: '',
		Contact_Working3: '',
		Contact_Good1: '',
		Contact_Good2: '',
		Contact_Good3: '',
		Contact_Excellent1: '',
		Contact_Excellent2: '',
		Contact_Excellent3: '',
		Contact_Remarks : '',
		Contact_Status	: ''		
	})

})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	
	req.assert('Contact_Name', 'Contact_Name is required').notEmpty()           //Validate name
	var errors = req.validationErrors()
    if( !errors ) { 

	
		var user = {
			
			Contact_ID:'',
			Contact_Name: req.sanitize('Contact_Name').escape().trim(),
			Contact_Designation: req.sanitize('Contact_Designation').escape().trim(),
			Contact_Email: req.sanitize('Contact_Email').escape().trim(),
			Contact_Mobile: req.sanitize('Contact_Mobile').escape().trim(),
			Contact_Reporting: req.sanitize('Contact_Reporting').escape().trim(),
			Contact_Location : req.sanitize('Contact_Location').escape().trim(),
			Contact_Project: req.sanitize('Contact_Project').escape().trim(),
			Contact_Working1 : req.sanitize('Contact_Working1').escape().trim(),
			Contact_Working2: req.sanitize('Contact_Working2').escape().trim(),
			Contact_Working3: req.sanitize('Contact_Working3').escape().trim(),
			Contact_Good1: req.sanitize('Contact_Good1').escape().trim(),
			Contact_Good2: req.sanitize('Contact_Good2').escape().trim(),
			Contact_Good3: req.sanitize('Contact_Good3').escape().trim(),
			Contact_Excellent1: req.sanitize('Contact_Excellent1').escape().trim(),
			Contact_Excellent2: req.sanitize('Contact_Excellent2').escape().trim(),
			Contact_Excellent3: req.sanitize('Contact_Excellent3').escape().trim(),
			Contact_Remarks : req.sanitize('Contact_Remarks').escape().trim(),
			Contact_Status: 'A'
		}
		
		
			req.getConnection(function(error, conn) {
			conn.query('select Contact_ID from custData order by Contact_ID desc limit 0,1',function(err,rows) {	
			var data1 = rows[0].Contact_ID	
			user.Contact_ID = parseInt(data1+1) 
			
			conn.query('INSERT INTO custData SET ?', user, function(err, result) {
				//if(err) throw errContact_ID
				if (err) {
					req.flash('error', err)
					res.render('user/add', {
						title: 'Add New User',
						Contact_ID: user.Contact_ID,
						Contact_Name: user.Contact_Name,
						Contact_Designation: user.Contact_Designation,	
						Contact_Email: user.Contact_Email,
						Contact_Mobile: user.Contact_Mobile,	
						Contact_Reporting: user.Contact_Reporting,
						Contact_Location: user.Contact_Location,	
						Contact_Project: user.Contact_Project,
						Contact_Working1: user.Contact_Working1,
						Contact_Working2: user.Contact_Working2,	
						Contact_Working3: user.Contact_Working3,
						Contact_Good1: user.Contact_Good1,	
						Contact_Good2: user.Contact_Good2,
						Contact_Good3: user.Contact_Good3,	
						Contact_Excellent1: user.Contact_Excellent1,
						Contact_Excellent2: user.Contact_Excellent2,	
						Contact_Excellent3: user.Contact_Excellent3,
						Contact_Remarks: user.Contact_Remarks,	
						Contact_Status: user.Contact_Status				
					})
				
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New User',
						Contact_ID: '',
						Contact_Name: '',
						Contact_Designation: '',
						Contact_Email: '',
						Contact_Mobile: '',
						Contact_Reporting: '',
						Contact_Location : '',
						Contact_Project: '',
						Contact_Working1 : '',
						Contact_Working2: '',
						Contact_Working3: '',
						Contact_Good1: '',
						Contact_Good2: '',
						Contact_Good3: '',
						Contact_Excellent1: '',
						Contact_Excellent2: '',
						Contact_Excellent3: '',
						Contact_Remarks : '',
						Contact_Status: '',					
					})
				}
			})
		})
	})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: 'Add New User',
          
			Contact_Name: req.body.Contact_Name,
			Contact_Designation: req.body.Contact_Designation,
			Contact_Email: req.body.Contact_Email,
			Contact_Mobile: req.body.Contact_Mobile,
			Contact_Reporting: req.body.Contact_Reporting,
			Contact_Location : req.body.Contact_Location,
			Contact_Project: req.body.Contact_Project,
			Contact_Working1 : req.body.Contact_Working1,
			Contact_Working2: req.body.Contact_Working2,
			Contact_Working3: req.body.Contact_Working3,
			Contact_Good1: req.body.Contact_Good1,
			Contact_Good2: req.body.Contact_Good2,
			Contact_Good3: req.body.Contact_Good3,
			Contact_Excellent1: req.body.Contact_Excellent1,
			Contact_Excellent2: req.body.Contact_Excellent2,
			Contact_Excellent3: req.body.Contact_Excellent3,
			Contact_Remarks : req.body.Contact_Remarks,
			Contact_Status: req.body.Contact_Status
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:Contact_ID)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM custData WHERE Contact_ID = ' + req.params.Contact_ID, function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with ID = ' + req.params.Contact_ID)
				res.redirect('/users')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('user/edit', {
					title: 'Edit User', 
					//data: rows[0],
					Contact_ID: rows[0].Contact_ID,
					
					Contact_Name: rows[0].Contact_Name,
					Contact_Designation: rows[0].Contact_Designation,
					Contact_Email: rows[0].Contact_Email,
					Contact_Mobile: rows[0].Contact_Mobile,
					Contact_Reporting: rows[0].Contact_Reporting,
					Contact_Location : rows[0].Contact_Location,
					Contact_Project: rows[0].Contact_Project,
					Contact_Working1 : rows[0].Contact_Working1,
					Contact_Working2: rows[0].Contact_Working2,
					Contact_Working3: rows[0].Contact_Working3,
					Contact_Good1: rows[0].Contact_Good1,
					Contact_Good2: rows[0].Contact_Good2,
					Contact_Good3: rows[0].Contact_Good3,
					Contact_Excellent1: rows[0].Contact_Excellent1,
					Contact_Excellent2: rows[0].Contact_Excellent2,
					Contact_Excellent3: rows[0].Contact_Excellent3,
					Contact_Remarks : rows[0].Contact_Remarks,
					Contact_Status: rows[0].Contact_Status


				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:Contact_ID)', function(req, res, next) {
	
    var errors = req.validationErrors()
    
    if( !errors ) {  
		var user = {
			Contact_Name: req.sanitize('Contact_Name').escape().trim(),
			Contact_Designation: req.sanitize('Contact_Designation').escape().trim(),
			Contact_Email: req.sanitize('Contact_Email').escape().trim(),
			Contact_Mobile: req.sanitize('Contact_Mobile').escape().trim(),
			Contact_Reporting: req.sanitize('Contact_Reporting').escape().trim(),
			Contact_Location : req.sanitize('Contact_Location').escape().trim(),
			Contact_Project: req.sanitize('Contact_Project').escape().trim(),
			Contact_Working1 : req.sanitize('Contact_Working1').escape().trim(),
			Contact_Working2: req.sanitize('Contact_Working2').escape().trim(),
			Contact_Working3: req.sanitize('Contact_Working3').escape().trim(),
			Contact_Good1: req.sanitize('Contact_Good1').escape().trim(),
			Contact_Good2: req.sanitize('Contact_Good2').escape().trim(),
			Contact_Good3: req.sanitize('Contact_Good3').escape().trim(),
			Contact_Excellent1: req.sanitize('Contact_Excellent1').escape().trim(),
			Contact_Excellent2: req.sanitize('Contact_Excellent2').escape().trim(),
			Contact_Excellent3: req.sanitize('Contact_Excellent3').escape().trim(),
			Contact_Remarks : req.sanitize('Contact_Remarks').escape().trim(),
			Contact_Status: req.sanitize('Contact_Status').escape().trim()

		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE custData SET ? WHERE Contact_ID = ' + req.params.Contact_ID, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						Contact_ID: req.params.Contact_ID,
						Contact_Name: req.params.Contact_Name,
						Contact_Designation: req.params.Contact_Designation,	
						Contact_Email:  req.params.Contact_Email,
						Contact_Mobile:  req.params.Contact_Mobile,	
						Contact_Reporting:  req.params.Contact_Reporting,
						Contact_Location:  req.params.Contact_Location,	
						Contact_Project:req.param.Contact_Project,
						Contact_Working1:  req.params.Contact_Working1,
						Contact_Working2:  req.params.Contact_Working2,	
						Contact_Working3:  req.params.Contact_Working3,
						Contact_Good1:  req.params.Contact_Good1,	
						Contact_Good2:  req.params.Contact_Good2,
						Contact_Good3:  req.params.Contact_Good3,	
						Contact_Excellent1:  req.params.Contact_Excellent1,
						Contact_Excellent2:  req.params.Contact_Excellent2,	
						Contact_Excellent3:  req.params.Contact_Excellent3,
						Contact_Remarks:  req.params.Contact_Remarks,	
						Contact_Status:  req.params.Contact_Status	
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						Contact_ID: req.params.Contact_ID,
						
						Contact_Name: req.body.Contact_Name,
						Contact_Designation: req.body.Contact_Designation,	
						Contact_Email:  req.body.Contact_Email,
						Contact_Mobile:  req.body.Contact_Mobile,	
						Contact_Reporting:  req.body.Contact_Reporting,
						Contact_Location:  req.body.Contact_Location,	
						Contact_Project:req.body.Contact_Project,
						Contact_Working1:  req.body.Contact_Working1,
						Contact_Working2:  req.body.Contact_Working2,	
						Contact_Working3:  req.body.Contact_Working3,
						Contact_Good1:  req.body.Contact_Good1,	
						Contact_Good2:  req.body.Contact_Good2,
						Contact_Good3:  req.body.Contact_Good3,	
						Contact_Excellent1:  req.body.Contact_Excellent1,
						Contact_Excellent2:  req.body.Contact_Excellent2,	
						Contact_Excellent3:  req.body.Contact_Excellent3,
						Contact_Remarks:  req.body.Contact_Remarks,	
						Contact_Status:  req.body.Contact_Status	
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit User',            
			Contact_ID: req.params.Contact_ID, 
		
			Contact_Name: req.body.Contact_Name,
			Contact_Designation: req.body.Contact_Designation,	
			Contact_Email:  req.body.Contact_Email,
			Contact_Mobile:  req.body.Contact_Mobile,	
			Contact_Reporting:  req.body.Contact_Reporting,
			Contact_Location:  req.body.Contact_Location,	
			Contact_Project:req.body.Contact_Project,
			Contact_Working1:  req.body.Contact_Working1,
			Contact_Working2:  req.body.Contact_Working2,	
			Contact_Working3:  req.body.Contact_Working3,
			Contact_Good1:  req.body.Contact_Good1,	
			Contact_Good2:  req.body.Contact_Good2,
			Contact_Good3:  req.body.Contact_Good3,	
			Contact_Excellent1:  req.body.Contact_Excellent1,
			Contact_Excellent2:  req.body.Contact_Excellent2,	
			Contact_Excellent3:  req.body.Contact_Excellent3,
			Contact_Remarks:  req.body.Contact_Remarks,	
			Contact_Status:  req.body.Contact_Status		
        })
    }
})

// DELETE USER
app.delete('/delete/(:Contact_ID)', function(req, res, next) {
	var user = { Contact_ID: req.params.Contact_ID }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM custData WHERE Contact_ID = ' + req.params.Contact_ID, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/users')
			} else {
				req.flash('success', 'User deleted successfully! Contact_ID = ' + req.params.Contact_ID)
				// redirect to users list page
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
