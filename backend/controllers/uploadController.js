import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import Agent from '../models/Agent.js';
import Task from '../models/Task.js';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const ext = path.extname(file.originalname);
    cb(null, validTypes.includes(ext));
  }
}).single('file');

export const handleUpload = async (req, res) => {
  const filePath = req.file.path;
  const records = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => records.push(row))
    .on('end', async () => {
      const agents = await Agent.find();
      const agentCount = agents.length;

      if (agentCount === 0) return res.status(400).json({ msg: 'No agents available' });

      const tasks = records.map((row, i) => ({
        firstName: row.FirstName,
        phone: row.Phone,
        notes: row.Notes,
        assignedTo: agents[i % agentCount]._id
      }));

      await Task.insertMany(tasks);
      res.json({ msg: 'Tasks distributed successfully' });
    });
};
