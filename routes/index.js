var express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const {body, validationResult } = require("express-validator");

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/user/register', (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	}

	User.findOne({email: req.body.email}, (err, user) => {
		if(err) {
			console.log(err);
			throw err
		};

		if(user) {
			return res.status(403).json({email: "Email already in use."});
		} else {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(req.body.password, salt, (err, hash) => {
				if(err) throw err;
				
				User.create(
					{
					email: req.body.email,
					password: hash
					},
					(err, ok) => {
						if(err) throw err;
						return res.send("ok");
					}
				);
				});
			});
		}
	});
});

router.get('/api/user/list', function(req, res) {
	User.find({}, (err, users) =>{
		if(err) return next(err);
		res.send(users);
	  })	
});

module.exports = router;
