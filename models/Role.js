import mongoose from 'mongoose';
const role = new mongoose.Schema({
  roleName: String,
});
export default model('roles', role);
