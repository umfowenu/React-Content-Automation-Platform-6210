import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  FiPlay, 
  FiPause, 
  FiEdit, 
  FiTrash2, 
  FiPlus,
  FiFileText,
  FiCalendar,
  FiTrendingUp,
  FiSettings,
  FiArrowLeft
} from 'react-icons/fi';
import { campaignService } from '../services/campaignService';
import { contentService } from '../services/contentService';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';

const CampaignDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: campaign, isLoading: campaignLoading, refetch } = useQuery(
    ['campaign', id],
    () => campaignService.getCampaign(id)
  );

  const { data: content, isLoading: contentLoading } = useQuery(
    ['campaign-content', id],
    () => campaignService.getCampaignContent(id)
  );

  const { data: analytics, isLoading: analyticsLoading } = useQuery(
    ['campaign-analytics', id],
    () => campaignService.getCampaignAnalytics(id)
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleToggleCampaign = async () => {
    setLoading(true);
    try {
      if (campaign.status === 'active') {
        await campaignService.pauseCampaign(id);
        toast.success('Campaign paused');
      } else {
        await campaignService.resumeCampaign(id);
        toast.success('Campaign resumed');
      }
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to update campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    setLoading(true);
    try {
      await contentService.generateContent({ campaignId: id });
      toast.success('Content generation started!');
      setShowGenerateModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-50">
              <SafeIcon icon={FiFileText} className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Content</p>
              <p className="text-2xl font-bold text-secondary-900">
                {campaign?.contentGenerated || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-success-50">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Published</p>
              <p className="text-2xl font-bold text-secondary-900">
                {campaign?.contentPublished || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-warning-50">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Scheduled</p>
              <p className="text-2xl font-bold text-secondary-900">
                {campaign?.contentScheduled || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-error-50">
              <SafeIcon icon={FiPlay} className="w-6 h-6 text-error-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Status</p>
              <p className="text-lg font-bold text-secondary-900 capitalize">
                {campaign?.status || 'Unknown'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Campaign Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Campaign Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-secondary-600 mb-1">Description</p>
            <p className="text-secondary-900">{campaign?.description || 'No description'}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-600 mb-1">Schedule</p>
            <p className="text-secondary-900 capitalize">{campaign?.schedule || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-600 mb-1">Target Keywords</p>
            <div className="flex flex-wrap gap-2">
              {campaign?.targetKeywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-secondary-600 mb-1">WordPress Site</p>
            <p className="text-secondary-900">{campaign?.wordpressSite || 'Not configured'}</p>
          </div>
        </div>
      </Card>

      {/* Content Sources */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Content Sources</h3>
        <div className="space-y-3">
          {campaign?.sources?.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-primary-100">
                  <SafeIcon icon={FiFileText} className="w-4 h-4 text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-900 capitalize">
                    {source.type}
                  </p>
                  <p className="text-xs text-secondary-500">{source.url}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-success-100 text-success-800 text-xs font-medium rounded-full">
                Active
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const ContentTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-secondary-900">Generated Content</h3>
        <Button onClick={() => setShowGenerateModal(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Generate Content
        </Button>
      </div>

      {contentLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content?.content?.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.status === 'published' 
                    ? 'bg-success-100 text-success-800'
                    : item.status === 'scheduled'
                    ? 'bg-warning-100 text-warning-800'
                    : 'bg-secondary-100 text-secondary-800'
                }`}>
                  {item.status}
                </span>
                <div className="flex space-x-1">
                  <Button size="small" variant="ghost">
                    <SafeIcon icon={FiEdit} className="w-3 h-3" />
                  </Button>
                  <Button size="small" variant="ghost">
                    <SafeIcon icon={FiTrash2} className="w-3 h-3 text-error-600" />
                  </Button>
                </div>
              </div>
              
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">
                {item.title}
              </h4>
              
              <p className="text-xs text-secondary-600 mb-4">
                {item.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-secondary-500">
                <span>
                  <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1 inline" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span>{item.wordCount} words</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      {analyticsLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-secondary-600">Total Views</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {analytics?.totalViews || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">Avg. Ranking</p>
                <p className="text-2xl font-bold text-secondary-900">
                  #{analytics?.avgRanking || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">Click-through Rate</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {analytics?.ctr || 0}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Keyword Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-2 text-sm font-medium text-secondary-600">Keyword</th>
                    <th className="text-left py-2 text-sm font-medium text-secondary-600">Position</th>
                    <th className="text-left py-2 text-sm font-medium text-secondary-600">Clicks</th>
                    <th className="text-left py-2 text-sm font-medium text-secondary-600">Impressions</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.keywordPerformance?.map((keyword, index) => (
                    <tr key={index} className="border-b border-secondary-100">
                      <td className="py-3 text-sm text-secondary-900">{keyword.keyword}</td>
                      <td className="py-3 text-sm text-secondary-900">#{keyword.position}</td>
                      <td className="py-3 text-sm text-secondary-900">{keyword.clicks}</td>
                      <td className="py-3 text-sm text-secondary-900">{keyword.impressions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Campaign Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-900">Auto-publish content</p>
              <p className="text-xs text-secondary-500">Automatically publish generated content</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-900">SEO optimization</p>
              <p className="text-xs text-secondary-500">Enable automatic SEO optimization</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-900">Image generation</p>
              <p className="text-xs text-secondary-500">Generate images for content</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-secondary-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-error-200">
        <h3 className="text-lg font-semibold text-error-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-error-700 mb-4">
          These actions cannot be undone. Please proceed with caution.
        </p>
        <div className="space-y-3">
          <Button variant="outline" className="border-error-300 text-error-700">
            Reset Campaign Data
          </Button>
          <Button variant="danger">
            Delete Campaign
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'content':
        return <ContentTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (campaignLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/campaigns">
            <Button variant="ghost" size="small">
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              {campaign?.name}
            </h1>
            <p className="text-secondary-600">
              {campaign?.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleToggleCampaign}
            loading={loading}
          >
            <SafeIcon 
              icon={campaign?.status === 'active' ? FiPause : FiPlay} 
              className="w-4 h-4 mr-2" 
            />
            {campaign?.status === 'active' ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline">
            <SafeIcon icon={FiEdit} className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${
              campaign?.status === 'active' ? 'bg-success-100' : 'bg-secondary-200'
            }`}>
              <SafeIcon 
                icon={campaign?.status === 'active' ? FiPlay : FiPause} 
                className={`w-4 h-4 ${
                  campaign?.status === 'active' ? 'text-success-600' : 'text-secondary-600'
                }`} 
              />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-900">
                Status: <span className="capitalize">{campaign?.status}</span>
              </p>
              <p className="text-xs text-secondary-500">
                Last updated: {new Date(campaign?.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium text-secondary-900">
              Next run: {campaign?.nextRun || 'Not scheduled'}
            </p>
            <p className="text-xs text-secondary-500">
              Schedule: {campaign?.schedule}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>

      {/* Generate Content Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate Content"
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600">
            This will generate new content based on your campaign settings and sources.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowGenerateModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateContent}
              loading={loading}
            >
              Generate Content
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignDetail;