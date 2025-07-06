import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  FiUser, 
  FiKey, 
  FiGlobe, 
  FiSettings,
  FiSave,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { integrationService } from '../services/integrationService';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiKey },
    { id: 'integrations', label: 'Integrations', icon: FiGlobe },
    { id: 'preferences', label: 'Preferences', icon: FiSettings }
  ];

  const ProfileSettings = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
        name: user?.name || '',
        email: user?.email || '',
        company: user?.company || '',
        website: user?.website || ''
      }
    });

    const onSubmit = async (data) => {
      setLoading(true);
      try {
        const updatedUser = await authService.updateProfile(data);
        updateUser(updatedUser);
        toast.success('Profile updated successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company"
            {...register('company')}
          />
          <Input
            label="Website"
            {...register('website')}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={loading}>
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    );
  };

  const SecuritySettings = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const newPassword = watch('newPassword');

    const onSubmit = async (data) => {
      setLoading(true);
      try {
        await authService.changePassword(data.currentPassword, data.newPassword);
        toast.success('Password changed successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to change password');
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Current Password"
          type="password"
          {...register('currentPassword', { required: 'Current password is required' })}
          error={errors.currentPassword?.message}
        />
        
        <Input
          label="New Password"
          type="password"
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' }
          })}
          error={errors.newPassword?.message}
        />
        
        <Input
          label="Confirm New Password"
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value => value === newPassword || 'Passwords do not match'
          })}
          error={errors.confirmPassword?.message}
        />

        <div className="flex justify-end">
          <Button type="submit" loading={loading}>
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </div>
      </form>
    );
  };

  const IntegrationSettings = () => {
    const [integrations, setIntegrations] = useState([
      { name: 'OpenAI', status: 'connected', apiKey: '••••••••••••••••' },
      { name: 'Claude', status: 'disconnected', apiKey: '' },
      { name: 'YouTube', status: 'connected', apiKey: '••••••••••••••••' },
      { name: 'WordPress', status: 'connected', apiKey: '••••••••••••••••' },
      { name: 'Stripe', status: 'connected', apiKey: '••••••••••••••••' }
    ]);

    const handleToggleIntegration = async (integration) => {
      setLoading(true);
      try {
        // Integration toggle logic here
        toast.success(`${integration.name} ${integration.status === 'connected' ? 'disconnected' : 'connected'}`);
      } catch (error) {
        toast.error(`Failed to toggle ${integration.name}`);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${
                  integration.status === 'connected' ? 'bg-success-100' : 'bg-secondary-100'
                }`}>
                  <SafeIcon 
                    icon={integration.status === 'connected' ? FiCheck : FiX} 
                    className={`w-4 h-4 ${
                      integration.status === 'connected' ? 'text-success-600' : 'text-secondary-600'
                    }`} 
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-secondary-900">
                    {integration.name}
                  </h3>
                  <p className="text-xs text-secondary-500">
                    {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="API Key"
                  value={integration.apiKey}
                  onChange={(e) => {
                    const updated = integrations.map(i => 
                      i.name === integration.name 
                        ? { ...i, apiKey: e.target.value }
                        : i
                    );
                    setIntegrations(updated);
                  }}
                  className="w-48"
                />
                <Button
                  size="small"
                  variant={integration.status === 'connected' ? 'outline' : 'primary'}
                  onClick={() => handleToggleIntegration(integration)}
                  loading={loading}
                >
                  {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const PreferencesSettings = () => {
    const [preferences, setPreferences] = useState({
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      autoPublish: false,
      seoOptimization: true
    });

    const handlePreferenceChange = (key) => {
      setPreferences(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };

    const savePreferences = async () => {
      setLoading(true);
      try {
        // Save preferences logic here
        toast.success('Preferences saved successfully!');
      } catch (error) {
        toast.error('Failed to save preferences');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-secondary-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-xs text-secondary-500">
                  {key === 'emailNotifications' && 'Receive email notifications for campaign updates'}
                  {key === 'pushNotifications' && 'Receive push notifications in browser'}
                  {key === 'weeklyReports' && 'Get weekly performance reports'}
                  {key === 'autoPublish' && 'Automatically publish generated content'}
                  {key === 'seoOptimization' && 'Enable automatic SEO optimization'}
                </p>
              </div>
              <button
                onClick={() => handlePreferenceChange(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-secondary-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={savePreferences} loading={loading}>
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'preferences':
        return <PreferencesSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;