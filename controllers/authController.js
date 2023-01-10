const { promisify } = require('util');
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
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
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

  // cheking if the email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //  checking the user exists & password is correct
  const user = await User.findOne({ email }).select('+password');

  console.log('user', user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //  if every thing ok then send the token

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  })

})

exports.protect = catchAsync(async (req, res, next) => {

  // Checking the token
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError("you are not login! Please Log in to get access", 401)
    )
  }

  // verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // Checking if user still exists
  const currentUser = await User.findById(decode.id)
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exists")
    )
  }

  // Checking if the user changed the password after the token has issued
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return naxt(
      new AppError("User recently changed the password! Please login again.", 401)
    )
  }

  // Grant access to protected routes
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to perform this action", 403))
    }

    next()
  }
}

// FORGET PASSWORD

exports.forgotPassword = catchAsync(async (req, res, next) => {
//  1) GET user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
      return next(new AppError("There is no user with email address.", 404))
    }
//  2) Generate the random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

//  3) Send it to user's email

  res.status(200).json({
    mess: "testing."
  })
});

exports.resetPassword = (req, res, next) => {};