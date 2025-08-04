import Agent from '../models/Agent.js';
import bcrypt from 'bcryptjs';

// Create a new agent
export const createAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ error: 'Agent already exists with this email' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const agent = new Agent({ name, email, mobile, password: hashed });
    await agent.save();

    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create agent' });
  }
};

// Get all agents
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password'); // Exclude password from response
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};

// Update an agent
export const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile } = req.body;

    const updatedAgent = await Agent.findByIdAndUpdate(
      id,
      { name, email, mobile },
      { new: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agent' });
  }
};

// Delete an agent
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAgent = await Agent.findByIdAndDelete(id);

    if (!deletedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete agent' });
  }
};


