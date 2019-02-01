const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'Users works'
    });
});

// @route   GET api/users/register
// @desc    register user
// @access  Public
router.post('/register', (req, res) => {
    const {
        errors,
        isValid
    } = validateRegisterInput(req.body); // destucturing

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                errors.email = 'Email Already exists';
                return res.status(400).json(errors);

                // return res.status(404).json({
                //     email: 'Email already exists'
                // });
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size
                    r: 'pg', // rating
                    d: 'mm' // default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
});

// @route   GET api/users/login
// @desc    Login User / returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const {
        errors,
        isValid
    } = validateLoginInput(req.body); // destucturing

    // Check Validation
    if (!isValid) {
        return res.status(404).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({
            email
        })
        .then(user => {
            // Check for user
            if (!user) {
                errors.email='User not found';
                return res.status(404).json(errors);

                // return res.status(404).json({
                //     email: 'User not found'
                // });
            }

            // User exists and check for password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // res.json({msg:'Success'});
                        // ************************ USER MATCHED **********************
                        // create JWT Payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };

                        // ************************ SIGN TOKEN **********************
                        jwt.sign(
                            payload,
                            keys.secretOrKey, {
                                expiresIn: 3600
                            },
                            //  callback
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        );
                    } else {
                        errors.password='Incorrect Password';
                        return res.status(400).json(errors);

                        // return res.status(404).json({
                        //     password: 'incorrect Password'
                        // });
                    }
                });
        });
});

// @route   GET api/users/current
// @desc    Return Current User
// @access  ****************  PRIVATE  ************************
router.get('/current', passport.authenticate('jwt', {
        session: false  // we r not using sessions
    }),
    (req, res) => {
        // res.json({msg:'Success'});
        // res.json(req.user);
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    });

module.exports = router;