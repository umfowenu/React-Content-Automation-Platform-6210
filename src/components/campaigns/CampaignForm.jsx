import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SafeIcon from '../../common/SafeIcon';

const CampaignForm = ({ campaign, onSubmit, loading, onCancel }) => {
  const [sources, setSources] = useState(campaign?.sources || []);
  const [templates, setTemplates] = useState(campaign?.templates || []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: campaign || {
      name: '',
      description: '',
      schedule: 'daily',
      targetKeywords: '',
      wordpressSite: '',
      aiProvider: 'openai'
    }
  });

  const scheduleOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom' }
  ];

  const templateOptions = [
    { value: 'best-products', label: 'X Best [Products] in 2025' },
    { value: 'ways-to', label: 'X Ways to [Achieve Goal]' },
    { value: 'tips-for', label: 'X [Topic] Tips for [Audience]' },
    { value: 'mistakes-avoid', label: 'X Common [Mistakes] to Avoid' },
    { value: 'essential-tools', label: 'X Essential [Tools] for [Purpose]' }
  ];

  const aiProviders = [
    { value: 'openai', label: 'OpenAI (GPT-4)' },
    { value: 'claude', label: 'Claude (Anthropic)' },
    { value: 'gemini', label: 'Google Gemini' }
  ];

  const addSource = () => {
    setSources([...sources, { type: 'rss', url: '', keywords: '' }]);
  };

  const removeSource = (index) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const updateSource = (index, field, value) => {
    const updated = sources.map((source, i) => 
      i === index ? { ...source, [field]: value } : source
    );
    setSources(updated);
  };

  const addTemplate = () => {
    setTemplates([...templates, { type: 'best-products', customPrompt: '' }]);
  };

  const removeTemplate = (index) => {
    setTemplates(templates.filter((_, i) => i !== index));
  };

  const updateTemplate = (index, field, value) => {
    const updated = templates.map((template, i) => 
      i === index ? { ...template, [field]: value } : template
    );
    setTemplates(updated);
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      sources,
      templates,
      targetKeywords: data.targetKeywords.split(',').map(k => k.trim())
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Campaign Name"
          placeholder="Enter campaign name"
          {...register('name', { required: 'Campaign name is required' })}
          error={errors.name?.message}
        />
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Schedule
          </label>
          <select
            {...register('schedule', { required: 'Schedule is required' })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {scheduleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Description"
        placeholder="Describe your campaign"
        {...register('description')}
        error={errors.description?.message}
      />

      <Input
        label="Target Keywords"
        placeholder="Enter keywords separated by commas"
        {...register('targetKeywords', { required: 'Target keywords are required' })}
        error={errors.targetKeywords?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="WordPress Site URL"
          placeholder="https://your-site.com"
          {...register('wordpressSite', { required: 'WordPress site is required' })}
          error={errors.wordpressSite?.message}
        />

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            AI Provider
          </label>
          <select
            {...register('aiProvider', { required: 'AI provider is required' })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {aiProviders.map(provider => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Sources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-secondary-900">Content Sources</h3>
          <Button type="button" variant="outline" size="small" onClick={addSource}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
            Add Source
          </Button>
        </div>

        <div className="space-y-3">
          {sources.map((source, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-secondary-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <select
                  value={source.type}
                  onChange={(e) => updateSource(index, 'type', e.target.value)}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="rss">RSS Feed</option>
                  <option value="youtube">YouTube Channel</option>
                  <option value="amazon">Amazon Products</option>
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  onClick={() => removeSource(index)}
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4 text-error-600" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Source URL"
                  value={source.url}
                  onChange={(e) => updateSource(index, 'url', e.target.value)}
                />
                <Input
                  placeholder="Keywords (optional)"
                  value={source.keywords}
                  onChange={(e) => updateSource(index, 'keywords', e.target.value)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-secondary-900">Content Templates</h3>
          <Button type="button" variant="outline" size="small" onClick={addTemplate}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
            Add Template
          </Button>
        </div>

        <div className="space-y-3">
          {templates.map((template, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-secondary-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <select
                  value={template.type}
                  onChange={(e) => updateTemplate(index, 'type', e.target.value)}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {templateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  onClick={() => removeTemplate(index)}
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4 text-error-600" />
                </Button>
              </div>

              <Input
                placeholder="Custom prompt (optional)"
                value={template.customPrompt}
                onChange={(e) => updateTemplate(index, 'customPrompt', e.target.value)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {campaign ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  );
};

export default CampaignForm;