import mongoose from 'mongoose';

export const ACTIVITY_ACTIONS = {
  REPORT_CREATED: 'REPORT_CREATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  REPORT_ASSIGNED: 'REPORT_ASSIGNED',
  SYNC_SUCCESS: 'SYNC_SUCCESS',
  REPORT_UPDATED: 'REPORT_UPDATED',
};

const activitySchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: [true, 'eventId is required for deduplication'],
      unique: true,
      trim: true,
      index: true,
    },
    reportClientId: {
      type: String,
      required: [true, 'reportClientId is required to associate activity'],
      trim: true,
      index: true,
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      required: false,
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      index: true,
    },
    previousValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    description: {
      type: String,
      required: [true, 'Activity description is required'],
      trim: true,
    },
    performedBy: {
      type: String,
      required: true,
      trim: true,
      default: 'System',
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: false,
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

// Compound index for chronological timeline per report
activitySchema.index({ reportClientId: 1, timestamp: -1 });

export const Activity = mongoose.model('Activity', activitySchema);

