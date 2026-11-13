import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const USER_ROLES = {
  FIELD_WORKER: 'FIELD_WORKER',
  COORDINATOR: 'COORDINATOR',
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: [USER_ROLES.FIELD_WORKER, USER_ROLES.COORDINATOR],
        message: '{VALUE} is not a valid user role',
      },
      default: USER_ROLES.FIELD_WORKER,
      index: true,
    },
    unit: {
      type: String,
      trim: true,
      default: 'Field Operations Unit',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plainPassword) {
  const saltRounds = 12;
  return bcrypt.hash(plainPassword, saltRounds);
};

export const User = mongoose.model('User', userSchema);

