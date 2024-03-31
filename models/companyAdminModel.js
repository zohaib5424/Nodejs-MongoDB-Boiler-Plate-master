import mongoose from 'mongoose';

import { v1 as uuidv1 } from 'uuid';

const companyAdminSchema = new mongoose.Schema({
  companyAdminId: { type: String, default: _ => uuidv1() },
  superAdminEditorId: { type: String, required: true, unique: true },
  parentId: { type: String, required: false, unique: true }, //used if any companyAdmin add another companyAdmin

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
companyAdminSchema.method({});

/**
 * Statics
 */
companyAdminSchema.statics = {};

export default mongoose.model('companyAdmin', companyAdminSchema);
