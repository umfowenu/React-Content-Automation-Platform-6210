import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  FiPlus, 
  FiPlay, 
  FiPause, 
  FiEdit, 
  FiTrash2, 
  FiCopy,
  FiMoreVertical,
  FiCalendar,
  FiTarget
} from 'react-icons/fi';
import { campaignService } from '../services/campaignService';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import CampaignForm from '../components/campaigns/CampaignForm';

const Campaigns = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: campaigns, isLoading, refetch } = useQuery(
    'campaigns',
    () => campaignService.getCampaigns()
  );

  const handleCreateCampaign = async (campaignData) => {
    setLoading(true);
    try {
      await campaignService.createCampaign(campaignData);
      toast.success('Campaign created successfully!');
      setShowCreateModal(false);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCampaign = async (campaign) => {
    try {
      if (campaign.status === 'active') {
        await campaignService.pauseCampaign(campaign.id);
        toast.success('Campaign paused');
      } else {
        await campaignService.resumeCampaign(campaign.id);
        toast.success('Campaign resumed');
      }
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to update campaign');
    }
  };

  const handleCloneCampaign = async (campaign) => {
    try {
      await campaignService.cloneCampaign(campaign.id);
      toast.success('Campaign cloned successfully!');
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to clone campaign');
    }
  };

  const handleDeleteCampaign = async (campaign) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await campaignService.deleteCampaign(campaign.id);
        toast.success('Campaign deleted successfully!');
        refetch();
      } catch (error) {
        toast.error(error.message || 'Failed to delete campaign');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Campaigns</h1>
          <p className="text-secondary-600">
            Manage your content automation campaigns
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {campaigns?.campaigns?.length === 0 ? (
        <Card className="p-12 text-center">
          <SafeIcon icon={FiTarget} className="w-16 h-16 mx-auto text-secondary-400 mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No campaigns yet
          </h3>
          <p className="text-secondary-600 mb-6">
            Get started by creating your first content automation campaign
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.campaigns?.map((campaign) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
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
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-success-100 text-success-800'
                        : 'bg-secondary-200 text-secondary-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <button className="p-1 rounded-md hover:bg-secondary-100">
                      <SafeIcon icon={FiMoreVertical} className="w-4 h-4 text-secondary-600" />
                    </button>
                  </div>
                </div>

                <Link to={`/campaigns/${campaign.id}`}>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2 hover:text-primary-600">
                    {campaign.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-secondary-600 mb-4">
                  {campaign.description}
                </p>

                <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                  <div className="flex items-center">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                    {campaign.schedule}
                  </div>
                  <div>
                    {campaign.contentGenerated} content pieces
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => handleToggleCampaign(campaign)}
                    >
                      <SafeIcon 
                        icon={campaign.status === 'active' ? FiPause : FiPlay} 
                        className="w-3 h-3 mr-1" 
                      />
                      {campaign.status === 'active' ? 'Pause' : 'Resume'}
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => handleCloneCampaign(campaign)}
                    >
                      <SafeIcon icon={FiCopy} className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <SafeIcon icon={FiEdit} className="w-3 h-3" />
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => handleDeleteCampaign(campaign)}
                    >
                      <SafeIcon icon={FiTrash2} className="w-3 h-3 text-error-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Campaign"
        size="large"
      >
        <CampaignForm
          onSubmit={handleCreateCampaign}
          loading={loading}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Campaign Modal */}
      <Modal
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        title="Edit Campaign"
        size="large"
      >
        {selectedCampaign && (
          <CampaignForm
            campaign={selectedCampaign}
            onSubmit={handleCreateCampaign}
            loading={loading}
            onCancel={() => setSelectedCampaign(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Campaigns;