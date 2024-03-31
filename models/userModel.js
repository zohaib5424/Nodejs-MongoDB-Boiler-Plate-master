import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: [
      'superAdminUser',
      'superAdminEditor',
      'companyAdmin',
      'companyEditor',
      'manager',
      'viewer',
    ],
    required: true,
  },

  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
userSchema.method({});

/**
 * Statics
 */
userSchema.statics = {};

export default mongoose.model('usersMain', userSchema);
