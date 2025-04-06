import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'] 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { 
      type: String,
      select: false // Don't include password by default in query results
    }
  }, 
  { 
    timestamps: true // Automatically create createdAt and updatedAt fields
  }
);

// Create and export the User model
// This prevents errors from model redefinition when Next.js hot-reloads in development
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);