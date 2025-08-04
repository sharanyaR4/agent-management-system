import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, FileText, Users, ChevronDown, ChevronRight, Download } from 'lucide-react';

interface Distribution {
  _id: string;
  agentName: string;
  agentEmail: string;
  itemCount: number;
  items: {
    firstName: string;
    phone: string;
    notes: string;
  }[];
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/lists/distributions');
      setDistributions(response.data);
    } catch (error) {
      console.error('Error fetching distributions:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      toast.error('Invalid file type. Please upload CSV, XLS, or XLSX files only.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      return;
    }
    
    setFile(file);
    toast.success('File selected successfully!');
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResult(response.data);
      toast.success('File uploaded and distributed successfully!');
      fetchDistributions();
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Upload failed';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const exportAgentItems = (agent: Distribution) => {
    const csvContent = [
      ['First Name', 'Phone', 'Notes'],
      ...agent.items.map(item => [item.firstName, item.phone, item.notes])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent.agentName}_items.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`Items exported for ${agent.agentName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">File Upload & Distribution</h1>
        <p className="text-gray-600 mt-2">Upload CSV or Excel files to distribute among agents</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload File</h2>
        
        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop your file here, or <button className="text-blue-600 underline">browse</button>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Supports CSV, XLS, XLSX files up to 5MB
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Select File
          </button>
        </div>

        {/* File Info */}
        {file && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Upload & Distribute'}
            </button>
          </div>
        )}

        {/* File Format Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Required CSV Format:</h3>
          <p className="text-sm text-blue-800">
            Your file should contain columns: <strong>FirstName</strong>, <strong>Phone</strong>, <strong>Notes</strong>
          </p>
        </div>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Upload Successful!</h3>
          <p className="text-green-800 mb-4">
            Distributed {uploadResult.totalItems} items among {uploadResult.distributions.length} agents
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadResult.distributions.map((dist: any) => (
              <div key={dist.agentId} className="bg-white p-4 rounded-lg border">
                <p className="font-medium">{dist.agentName}</p>
                <p className="text-sm text-gray-600">{dist.itemCount} items</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distributions Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Distribution Results</h2>
          <p className="text-gray-600 mt-1">View how items are distributed among agents</p>
        </div>

        {distributions.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No distributions yet</h3>
            <p className="text-gray-600">Upload a file to see distribution results here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {distributions.map((agent) => (
              <div key={agent._id} className="p-6">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedAgent(expandedAgent === agent._id ? null : agent._id)}
                >
                  <div className="flex items-center space-x-4">
                    {expandedAgent === agent._id ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{agent.agentName}</h3>
                      <p className="text-sm text-gray-600">{agent.agentEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {agent.itemCount} items
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportAgentItems(agent);
                      }}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Items */}
                {expandedAgent === agent._id && (
                  <div className="mt-4 ml-9">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 text-sm font-medium text-gray-700">First Name</th>
                              <th className="text-left py-2 text-sm font-medium text-gray-700">Phone</th>
                              <th className="text-left py-2 text-sm font-medium text-gray-700">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {agent.items.map((item, index) => (
                              <tr key={index}>
                                <td className="py-2 text-sm text-gray-900">{item.firstName}</td>
                                <td className="py-2 text-sm text-gray-900">{item.phone}</td>
                                <td className="py-2 text-sm text-gray-600">{item.notes || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;