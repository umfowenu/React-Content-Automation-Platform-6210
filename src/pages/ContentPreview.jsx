import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiSave, 
  FiEye, 
  FiSend,
  FiCalendar,
  FiSettings,
  FiImage
} from 'react-icons/fi';
import { contentService } from '../services/contentService';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';

const ContentPreview = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: contentData, isLoading, refetch } = useQuery(
    ['content', contentId],
    () => contentService.getContent(contentId),
    {
      onSuccess: (data) => {
        setContent(data.content);
      }
    }
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      await contentService.updateContent(contentId, { content });
      toast.success('Content saved successfully!');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await contentService.publishContent(contentId, {
        publishNow: true
      });
      toast.success('Content published successfully!');
      setShowPublishModal(false);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to publish content');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (scheduleData) => {
    setLoading(true);
    try {
      await contentService.scheduleContent(contentId, scheduleData);
      toast.success('Content scheduled successfully!');
      setShowScheduleModal(false);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to schedule content');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await contentService.analyzeContent(contentId);
      toast.success('Content analyzed successfully!');
      // Handle analysis results
    } catch (error) {
      toast.error(error.message || 'Failed to analyze content');
    } finally {
      setLoading(false);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigate(-1)}
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              {contentData?.title}
            </h1>
            <p className="text-secondary-600">
              {contentData?.campaign?.name} • {contentData?.wordCount} words
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleAnalyze}
            loading={loading}
          >
            <SafeIcon icon={FiSettings} className="w-4 h-4 mr-2" />
            Analyze
          </Button>
          
          {contentData?.status === 'draft' && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(true)}
              >
                <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button
                onClick={() => setShowPublishModal(true)}
              >
                <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              contentData?.status === 'published' 
                ? 'bg-success-100 text-success-800'
                : contentData?.status === 'scheduled'
                ? 'bg-warning-100 text-warning-800'
                : 'bg-secondary-100 text-secondary-800'
            }`}>
              {contentData?.status}
            </span>
            <div>
              <p className="text-sm font-medium text-secondary-900">
                Created: {new Date(contentData?.createdAt).toLocaleString()}
              </p>
              {contentData?.publishedAt && (
                <p className="text-xs text-secondary-500">
                  Published: {new Date(contentData?.publishedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="small"
              onClick={() => setIsEditing(!isEditing)}
            >
              <SafeIcon icon={isEditing ? FiEye : FiEdit} className="w-4 h-4 mr-1" />
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
            
            {isEditing && (
              <Button
                size="small"
                onClick={handleSave}
                loading={loading}
              >
                <SafeIcon icon={FiSave} className="w-4 h-4 mr-1" />
                Save
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={contentData?.title || ''}
                  className="w-full text-2xl font-bold border-none outline-none bg-transparent"
                  placeholder="Content title..."
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 p-4 border border-secondary-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Write your content here..."
                />
              </div>
            ) : (
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold text-secondary-900 mb-6">
                  {contentData?.title}
                </h1>
                <div
                  className="text-secondary-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO Analysis */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">SEO Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Keyword Density</span>
                <span className="text-sm font-medium text-success-600">2.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Readability</span>
                <span className="text-sm font-medium text-success-600">Good</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Meta Description</span>
                <span className="text-sm font-medium text-warning-600">Missing</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Images</span>
                <span className="text-sm font-medium text-error-600">0</span>
              </div>
            </div>
          </Card>

          {/* Keywords */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Target Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {contentData?.keywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Card>

          {/* Images */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Images</h3>
              <Button size="small" variant="outline">
                <SafeIcon icon={FiImage} className="w-4 h-4 mr-1" />
                Generate
              </Button>
            </div>
            <div className="space-y-2">
              <div className="w-full h-24 bg-secondary-100 rounded-lg flex items-center justify-center">
                <p className="text-sm text-secondary-500">Featured Image</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="w-full h-16 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <p className="text-xs text-secondary-500">Inline 1</p>
                </div>
                <div className="w-full h-16 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <p className="text-xs text-secondary-500">Inline 2</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Publishing Options */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Publishing</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-secondary-600">WordPress Site</p>
                <p className="text-sm font-medium text-secondary-900">
                  {contentData?.targetSite || 'Not selected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">Category</p>
                <p className="text-sm font-medium text-secondary-900">
                  {contentData?.category || 'Uncategorized'}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {contentData?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Publish Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Publish Content"
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600">
            Are you sure you want to publish this content to WordPress?
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPublishModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              loading={loading}
            >
              Publish Now
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Content"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Publish Date
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowScheduleModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSchedule({ publishAt: new Date() })}
              loading={loading}
            >
              Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentPreview;