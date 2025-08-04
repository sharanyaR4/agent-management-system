import csv from 'csv-parser';
import XLSX from 'xlsx';
import { Readable } from 'stream';
import ListItem from '../models/ListItem.js';
import Agent from '../models/Agent.js';

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Get exactly 5 agents (as per requirement)
    const agents = await Agent.find().limit(5);
    if (agents.length < 5) {
      return res.status(400).json({ 
        error: 'Exactly 5 agents required. Current agents: ' + agents.length 
      });
    }

    let results = [];
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname.toLowerCase();

    // Handle different file formats
    if (fileName.endsWith('.csv')) {
      // Process CSV
      const bufferStream = Readable.from(fileBuffer);
      
      return new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on('data', (data) => {
            // Validate required fields
            if (!data.FirstName || !data.Phone) {
              return reject(new Error('Invalid CSV format. FirstName and Phone are required.'));
            }
            results.push({
              firstName: data.FirstName?.trim(),
              phone: data.Phone?.trim(),
              notes: data.Notes?.trim() || ''
            });
          })
          .on('end', async () => {
            try {
              await distributeAndSave(results, agents, res);
              resolve();
            } catch (error) {
              reject(error);
            }
          })
          .on('error', reject);
      });
      
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // Process Excel files
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Validate and format data
      results = jsonData.map(row => {
        if (!row.FirstName || !row.Phone) {
          throw new Error('Invalid Excel format. FirstName and Phone are required.');
        }
        return {
          firstName: row.FirstName?.toString().trim(),
          phone: row.Phone?.toString().trim(),
          notes: row.Notes?.toString().trim() || ''
        };
      });
      
      await distributeAndSave(results, agents, res);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Error uploading or processing file' });
  }
};

// Helper function to distribute items equally among 5 agents
const distributeAndSave = async (items, agents, res) => {
  try {
    // Clear previous distributions
    await ListItem.deleteMany({});
    
    const total = items.length;
    const perAgent = Math.floor(total / 5); // Exactly 5 agents
    let remainder = total % 5;
    
    let startIndex = 0;
    const distributions = [];
    
    for (let i = 0; i < 5; i++) {
      const itemsForThisAgent = perAgent + (remainder > 0 ? 1 : 0);
      remainder--;
      
      const agentItems = items.slice(startIndex, startIndex + itemsForThisAgent).map(item => ({
        ...item,
        agentId: agents[i]._id,
      }));
      
      if (agentItems.length > 0) {
        await ListItem.insertMany(agentItems);
        distributions.push({
          agentId: agents[i]._id,
          agentName: agents[i].name,
          itemCount: agentItems.length
        });
      }
      
      startIndex += itemsForThisAgent;
    }
    
    res.status(200).json({ 
      message: 'File uploaded and distributed successfully',
      totalItems: total,
      distributions
    });
    
  } catch (error) {
    throw error;
  }
};

// Get distributed lists for all agents
export const getDistributedLists = async (req, res) => {
  try {
    const distributions = await ListItem.aggregate([
      {
        $lookup: {
          from: 'agents',
          localField: 'agentId',
          foreignField: '_id',
          as: 'agent'
        }
      },
      {
        $unwind: '$agent'
      },
      {
        $group: {
          _id: '$agentId',
          agentName: { $first: '$agent.name' },
          agentEmail: { $first: '$agent.email' },
          items: {
            $push: {
              firstName: '$firstName',
              phone: '$phone',
              notes: '$notes'
            }
          },
          itemCount: { $sum: 1 }
        }
      }
    ]);
    
    res.json(distributions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distributed lists' });
  }
};

// Get items for a specific agent
export const getAgentItems = async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const items = await ListItem.find({ agentId }).populate('agentId', 'name email');
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent items' });
  }
};