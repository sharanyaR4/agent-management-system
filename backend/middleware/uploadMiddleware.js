// middleware/uploadMiddleware.js
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
  ];
  
  const allowedExtensions = ['.csv', '.xls', '.xlsx'];
  const fileExtension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, XLS, and XLSX files are allowed.'), false);
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});