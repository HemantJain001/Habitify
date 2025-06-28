import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  hashedPassword?: string;
  emailVerified?: Date;
  streak: number; // Keep streak but remove XP
  lastActiveDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  hashedPassword: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastActiveDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
