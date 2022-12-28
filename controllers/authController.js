const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).send({
    status: 'Success',
    token,
    data: {
      user: newUser
    }
  })
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  console.log({email, password});

  // cheking if the email and password exists
  if(!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //  checking the user exists & password is correct
  const user = await User.findOne({ email }).select('+password');

  console.log('user', user);

  if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //  if every thing ok then send the token

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  })

})