import mongoose from 'mongoose';

import { v1 as uuidv1 } from 'uuid';

const viewerSchema = new mongoose.Schema({
  viewerId: { type: String, default: _ => uuidv1() },
  managerId: { type: String, required: true, unique: true },

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
viewerSchema.method({});

/**
 * Statics
 */
viewerSchema.statics = {};

export default mongoose.model('viewer', viewerSchema);
