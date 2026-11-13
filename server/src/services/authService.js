import { User, USER_ROLES } from '../models/User.js';
import { signToken } from '../utils/token.js';

export async function registerUser({ name, email, password, role, unit }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    const error = new Error(`An account with email "${normalizedEmail}" already exists.`);
    error.statusCode = 409;
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  // Enforce FIELD_WORKER on public registration
  const assignedRole = USER_ROLES.FIELD_WORKER;
  const passwordHash = await User.hashPassword(password);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: assignedRole,
    unit: unit?.trim() || 'Field Operations Unit',
  });

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: user.toJSON(), token };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: user.toJSON(), token };
}

export async function seedInitialCoordinator({ email, password, name, unit }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return { user: existing.toJSON(), created: false };
  }

  const passwordHash = await User.hashPassword(password);
  const coordinator = await User.create({
    name: name || 'Operations Coordinator',
    email: normalizedEmail,
    passwordHash,
    role: USER_ROLES.COORDINATOR,
    unit: unit || 'Central Dispatch & Triage Desk',
  });

  return { user: coordinator.toJSON(), created: true };
}

