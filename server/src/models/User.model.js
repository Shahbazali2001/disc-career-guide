import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const EDUCATION_LEVELS = [
  'No Formal Education',
  'High School / GED',
  'Vocational / Technical Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate / PhD',
];

const careerProfileSchema = new mongoose.Schema(
  {
    educationLevel: {
      type: String,
      enum: EDUCATION_LEVELS,
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: [100, 'Field of study must be at most 100 characters'],
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      max: [60, 'Years of experience must be at most 60'],
    },
    age: {
      type: Number,
      min: [14, 'Age must be at least 14'],
      max: [100, 'Age must be at most 100'],
    },
    completedAt: {
      type: Date,
    },
  },
  { _id: false }
);

export const isCareerProfileComplete = (profile) =>
  Boolean(
    profile &&
      EDUCATION_LEVELS.includes(profile.educationLevel) &&
      typeof profile.fieldOfStudy === 'string' &&
      profile.fieldOfStudy.trim().length > 0 &&
      typeof profile.yearsOfExperience === 'number' &&
      Number.isFinite(profile.yearsOfExperience) &&
      profile.yearsOfExperience >= 0 &&
      typeof profile.age === 'number' &&
      Number.isFinite(profile.age) &&
      profile.age >= 14
  );

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name must be at most 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    careerProfile: {
      type: careerProfileSchema,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;
