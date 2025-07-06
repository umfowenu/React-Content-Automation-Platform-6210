import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  FiPlus, 
  FiTarget, 
  FiFileText, 
  FiTrendingUp, 
  FiClock,
  FiPlay,
  FiPause
} from 'react-icons/fi';
import { campaignService } from '../services/campaignService';
import { contentService } from '../services/contentService';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalContent: 0,
    publishedToday: 0
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery(
    'campaigns',
    () => campaignService.getCampaigns({ limit: 5 }),
    {
      onSuccess: (data) => {
        setStats(prev => ({
          ...prev,
          totalCampaigns: data.total,
          activeCampaigns: data.campaigns.filter(c => c.status === 'active').length
        }));
      }
    }
  );

  const { data: recentContent, isLoading: contentLoading } = useQuery(
    'recent-content',
    () => contentService.getContent({ limit: 5, sort: 'createdAt' })
  );

  const statCards = [
    {
      title: 'Total Campaigns',
      value: stats.totalCampaigns,
      icon: FiTarget,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: FiPlay,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      title: 'Content Generated',
      value: stats.totalContent,
      icon: FiFileText,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      title: 'Published Today',
      value: stats.publishedToday,
      icon: FiTrendingUp,
      color: 'text-error-600',
      bgColor: 'bg-error-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">
            Welcome back! Here's what's happening with your content automation.
          </p>
        </div>
        <Link to="/campaigns">
          <Button>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Recent Campaigns
            </h2>
            <Link
              to="/campaigns"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          
          {campaignsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns?.campaigns?.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${
                      campaign.status === 'active' ? 'bg-success-100' : 'bg-secondary-200'
                    }`}>
                      <SafeIcon 
                        icon={campaign.status === 'active' ? FiPlay : FiPause} 
                        className={`w-4 h-4 ${
                          campaign.status === 'active' ? 'text-success-600' : 'text-secondary-600'
                        }`} 
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-secondary-900">
                        {campaign.name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {campaign.contentGenerated} content pieces
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    campaign.status === 'active' 
                      ? 'bg-success-100 text-success-800'
                      : 'bg-secondary-200 text-secondary-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Content */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Recent Content
            </h2>
            <Link
              to="/campaigns"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          
          {contentLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-3">
              {recentContent?.content?.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-primary-100">
                      <SafeIcon icon={FiFileText} className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-secondary-900">
                        {content.title}
                      </p>
                      <p className="text-xs text-secondary-500 flex items-center">
                        <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                        {new Date(content.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    content.status === 'published' 
                      ? 'bg-success-100 text-success-800'
                      : 'bg-warning-100 text-warning-800'
                  }`}>
                    {content.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;