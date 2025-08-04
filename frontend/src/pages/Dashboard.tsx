import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Upload, FileText, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalAgents: number;
  totalDistributions: number;
  totalItems: number;
  recentActivity: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    totalDistributions: 0,
    totalItems: 0,
    recentActivity: 'No recent activity'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [agentsResponse, distributionsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/agents'),
        axios.get('http://localhost:5000/api/lists/distributions')
      ]);

      const agents = agentsResponse.data;
      const distributions = distributionsResponse.data;
      const totalItems = distributions.reduce((sum: number, dist: any) => sum + dist.itemCount, 0);

      setStats({
        totalAgents: agents.length,
        totalDistributions: distributions.length,
        totalItems,
        recentActivity: distributions.length > 0 ? 'Files distributed recently' : 'No recent activity'
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Agents',
      value: stats.totalAgents,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Distributions',
      value: stats.totalDistributions,
      icon: FileText,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: Upload,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Growth',
      value: '+12%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your Agent Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Manage Agents</h3>
            <p className="text-sm text-gray-600">Add, edit, or remove agents</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Upload className="h-8 w-8 text-emerald-600 mb-2" />
            <h3 className="font-medium text-gray-900">Upload Files</h3>
            <p className="text-sm text-gray-600">Distribute CSV/Excel files</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FileText className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">View Reports</h3>
            <p className="text-sm text-gray-600">Check distribution reports</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <p className="text-sm text-gray-700">{stats.recentActivity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;