import mongoose from 'mongoose';

import { v1 as uuidv1 } from 'uuid';

const superAdminUserSchema = new mongoose.Schema({
  // superAdminUserId: { type: String, default: _ => uuidv1() },
  superAdminUserId: { type: String, default: uuidv1 },
  parentId: { type: String, required: false, unique: true }, //used if any superAdminUser add another superAdminUser

  name: { type: String, required: false },
  gender: { type: String, required: false },

  email: { type: String, required: true, unique: true },
  phoneno: { type: String, required: false },
  password: { type: String, required: true },

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
superAdminUserSchema.method({});

/**
 * Statics
 */
superAdminUserSchema.statics = {};

export default mongoose.model('superAdminUser', superAdminUserSchema);
