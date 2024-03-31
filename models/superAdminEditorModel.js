import mongoose from 'mongoose';

import { v1 as uuidv1 } from 'uuid';

const superAdminEditorSchema = new mongoose.Schema({
  superAdminEditorId: { type: String, default: _ => uuidv1() },
  superAdminUserId: { type: String, required: true, unique: true },

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
superAdminEditorSchema.method({});

/**
 * Statics
 */
superAdminEditorSchema.statics = {};

export default mongoose.model('superAdminEditor', superAdminEditorSchema);
