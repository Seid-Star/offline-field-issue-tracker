import mongoose from 'mongoose';

export const REPORT_CATEGORIES = [
  'Water Infrastructure',
  'Electrical Equipment',
  'Road Infrastructure',
  'Public Facilities',
  'Safety Concern',
  'Maintenance',
  'Other',
];

export const REPORT_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const WORKFLOW_STATUSES = [
  'Draft',
  'Submitted',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected',
];

const reportSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: [true, 'Client UUID (clientId) is required for offline sync idempotency'],
      unique: true,
      trim: true,
      index: true,
    },
    serverId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    category: {
      type: String,
      required: [true, 'Infrastructure category is required'],
      enum: {
        values: REPORT_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    location: {
      name: {
        type: String,
        required: [true, 'Location name is required'],
        trim: true,
        minlength: [2, 'Location name must be at least 2 characters'],
      },
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
        default: null,
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
        default: null,
      },
    },
    priority: {
      type: String,
      required: true,
      enum: {
        values: REPORT_PRIORITIES,
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: WORKFLOW_STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'Submitted',
      index: true,
    },
    syncVersion: {
      type: Number,
      required: true,
      default: 1,
      min: [1, 'syncVersion must be at least 1'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    reportedBy: {
      type: String,
      required: true,
      trim: true,
      default: 'Field Worker',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    assignee: {
      type: String,
      trim: true,
      default: null,
    },
    reportedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for query optimization
reportSchema.index({ status: 1, priority: 1 });
reportSchema.index({ reportedAt: -1 });
reportSchema.index({ updatedAt: -1 });

export const Report = mongoose.model('Report', reportSchema);

