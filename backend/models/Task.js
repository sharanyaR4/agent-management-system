import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  firstName: String,
  phone: String,
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
});

export default mongoose.model('Task', taskSchema);