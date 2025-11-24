import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// ----------------------------
// FIXED IResume (NO Document)
// ----------------------------
export interface IResume {
  filename: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
}

// ----------------------------
// IUser Interface
// ----------------------------
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;
  location?: string;
  bio?: string;
  skills: string[];
  profileImage?: string;
  profileImageType?: string;
  resume?: IResume | null;     // NOW SAFE
  profileCompletion: number;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ----------------------------
// Resume Schema (NO _id)
// ----------------------------
const resumeSchema = new Schema<IResume>(
  {
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false } // IMPORTANT FIX
);

// ----------------------------
// User Schema
// ----------------------------
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    bio: { type: String, maxlength: 500, trim: true },
    skills: [{ type: String, trim: true }],
    profileImage: String,
    profileImageType: String,

    // FIXED: resume is now a plain object
    resume: {
      type: resumeSchema,
      default: null,
    },

    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// ----------------------------
// Password Hashing
// ----------------------------
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: unknown) {
    next(err as Error);
  }
});

// ----------------------------
// Compare Password
// ----------------------------
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) throw new Error('Password not stored');
  return bcrypt.compare(candidatePassword, this.password);
};

// ----------------------------
// Virtual Public Profile
// ----------------------------
userSchema.virtual('publicProfile').get(function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone,
    location: this.location,
    bio: this.bio,
    skills: this.skills,
    profileImage: this.profileImage,
    profileImageType: this.profileImageType,
    resume: this.resume,
    profileCompletion: this.profileCompletion,
    emailVerified: this.emailVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

// Include virtuals in JSON
userSchema.set('toJSON', { virtuals: true });

// ----------------------------
// Custom static functions
// ----------------------------
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email }).select('+password');
};

userSchema.statics.updateProfileCompletion = async function (userId: string) {
  const user = await this.findById(userId);
  if (!user) return 0;

  let completion = 0;

  // Basic Info
  if (user.name) completion += 15;
  if (user.email) completion += 15;

  // Profile Details
  if (user.phone) completion += 10;
  if (user.location) completion += 10;
  if (user.bio) completion += 10;
  if (user.skills?.length > 0) completion += 10;

  // Files
  if (user.profileImage) completion += 15;
  if (user.resume) completion += 15;

  user.profileCompletion = Math.min(100, completion);
  await user.save();

  return user.profileCompletion;
};

// ----------------------------
// Export Model
// ----------------------------
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
