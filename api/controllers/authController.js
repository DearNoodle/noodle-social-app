const jwt = require('jsonwebtoken');
const query = require('../models/query');
const { validationResult } = require('express-validator');

const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';

const expireTimeString = '60m';
const expireTimeValue = 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: expireTimeValue,
  sameSite: 'lax',
};

async function registerLocalUser(req, res) {
  const validateErr = validationResult(req);
  if (!validateErr.isEmpty()) {
    return res.status(400).send({
      errors: validateErr.array(),
    });
  }
  await query.createLocalUser(req);
  res.status(201).send('Register Success');
}

async function loginLocalUser(req, res) {
  const token = jwt.sign({ userId: req.user.id }, jwtSecret, { expiresIn: expireTimeString });
  res.cookie('accessToken', token, cookieOptions);
  res.status(200).send('Login successful');
}

async function loginGHUser(req, res) {
  const token = jwt.sign({ userId: req.user.id }, jwtSecret, { expiresIn: expireTimeString });
  res.cookie('accessToken', token, cookieOptions);
  res.redirect(process.env.FRONTEND_URL || '/');
}

async function logoutUser(req, res) {
  res.cookie('accessToken', '', {
    ...cookieOptions,
    expires: new Date(0),
  });
  res.status(200).send('Logout successful');
}

async function getUserId(req, res) {
  res.status(200).send({ userId: req.user.id });
}

module.exports = {
  registerLocalUser,
  loginLocalUser,
  loginGHUser,
  logoutUser,
  getUserId,
};
