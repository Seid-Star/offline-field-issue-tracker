import * as authService from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    return res.status(200).json({ user: req.user.toJSON ? req.user.toJSON() : req.user });
  } catch (err) {
    next(err);
  }
}

