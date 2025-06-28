import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: string;
  userId: string;
  text: string;
  completed: boolean;
  identity: 'brain' | 'muscle' | 'money';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const TaskSchema = new Schema<ITask>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  identity: {
    type: String,
    required: true,
    enum: ['brain', 'muscle', 'money'],
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Create indexes
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, identity: 1 });
TaskSchema.index({ userId: 1, completed: 1 });

// Pre-save middleware to set completedAt
TaskSchema.pre('save', function(next) {
  if (this.isModified('completed')) {
    if (this.completed && !this.completedAt) {
      this.completedAt = new Date();
    } else if (!this.completed) {
      this.completedAt = undefined;
    }
  }
  next();
});

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
