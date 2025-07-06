import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';
import { 
  FiCreditCard, 
  FiDownload, 
  FiCheck, 
  FiX
} from 'react-icons/fi';
import { billingService } from '../services/billingService';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Billing = () => {
  const [activeTab, setActiveTab] = useState('subscription');
  const [loading, setLoading] = useState(false);

  const { data: subscription, isLoading: subscriptionLoading } = useQuery(
    'subscription',
    billingService.getSubscription
  );

  const { data: plans, isLoading: plansLoading } = useQuery(
    'plans',
    billingService.getPlans
  );

  const { data: invoices, isLoading: invoicesLoading } = useQuery(
    'invoices',
    billingService.getInvoices
  );

  const { data: usage, isLoading: usageLoading } = useQuery(
    'usage',
    billingService.getUsage
  );

  const tabs = [
    { id: 'subscription', label: 'Subscription' },
    { id: 'usage', label: 'Usage' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'payment', label: 'Payment Methods' }
  ];

  const handleUpgrade = async (planId) => {
    setLoading(true);
    try {
      await billingService.updateSubscription(subscription.id, planId);
      toast.success('Subscription updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      setLoading(true);
      try {
        await billingService.cancelSubscription(subscription.id);
        toast.success('Subscription cancelled successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to cancel subscription');
      } finally {
        setLoading(false);
      }
    }
  };

  const SubscriptionTab = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Current Plan</h3>
          {subscription?.status === 'active' && (
            <span className="px-3 py-1 bg-success-100 text-success-800 text-sm font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        
        {subscriptionLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-secondary-600">Plan</p>
              <p className="text-lg font-semibold text-secondary-900">
                {subscription?.plan?.name || 'Free'}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-600">Price</p>
              <p className="text-lg font-semibold text-secondary-900">
                ${subscription?.plan?.price || 0}/month
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-600">Next billing</p>
              <p className="text-lg font-semibold text-secondary-900">
                {subscription?.nextBillingDate || 'N/A'}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plansLoading ? (
            <LoadingSpinner />
          ) : (
            plans?.map((plan) => (
              <Card key={plan.id} className={`p-6 ${
                plan.featured ? 'border-2 border-primary-500' : ''
              }`}>
                {plan.featured && (
                  <div className="flex items-center justify-center mb-4">
                    <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-secondary-900 mb-2">
                    {plan.name}
                  </h4>
                  <p className="text-3xl font-bold text-secondary-900">
                    ${plan.price}
                    <span className="text-sm text-secondary-600">/month</span>
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-success-600 mr-2" />
                      <span className="text-sm text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.featured ? 'primary' : 'outline'}
                  onClick={() => handleUpgrade(plan.id)}
                  loading={loading}
                  disabled={subscription?.plan?.id === plan.id}
                >
                  {subscription?.plan?.id === plan.id ? 'Current Plan' : 'Upgrade'}
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Cancel Subscription */}
      {subscription?.status === 'active' && (
        <Card className="p-6 border-error-200">
          <h3 className="text-lg font-semibold text-error-900 mb-2">
            Cancel Subscription
          </h3>
          <p className="text-sm text-error-700 mb-4">
            Cancelling your subscription will downgrade your account to the free plan at the end of your current billing period.
          </p>
          <Button
            variant="danger"
            onClick={handleCancelSubscription}
            loading={loading}
          >
            Cancel Subscription
          </Button>
        </Card>
      )}
    </div>
  );

  const UsageTab = () => (
    <div className="space-y-6">
      {usageLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Usage Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Current Usage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-secondary-600">Articles Generated</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {usage?.articlesGenerated || 0}
                </p>
                <p className="text-xs text-secondary-500">
                  of {usage?.articlesLimit || 'unlimited'} limit
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">API Calls</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {usage?.apiCalls || 0}
                </p>
                <p className="text-xs text-secondary-500">
                  of {usage?.apiLimit || 'unlimited'} limit
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">Storage Used</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {usage?.storageUsed || 0} GB
                </p>
                <p className="text-xs text-secondary-500">
                  of {usage?.storageLimit || 'unlimited'} limit
                </p>
              </div>
            </div>
          </Card>

          {/* Usage Charts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Usage History</h3>
            <div className="h-64 bg-secondary-50 rounded-lg flex items-center justify-center">
              <p className="text-secondary-600">Usage chart would go here</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );

  const InvoicesTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Billing History</h3>
        {invoicesLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-2 text-sm font-medium text-secondary-600">Date</th>
                  <th className="text-left py-2 text-sm font-medium text-secondary-600">Amount</th>
                  <th className="text-left py-2 text-sm font-medium text-secondary-600">Status</th>
                  <th className="text-left py-2 text-sm font-medium text-secondary-600">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices?.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-secondary-100">
                    <td className="py-3 text-sm text-secondary-900">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm text-secondary-900">
                      ${invoice.amount}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-success-100 text-success-800'
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => billingService.downloadInvoice(invoice.id)}
                      >
                        <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const PaymentTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
            <div className="flex items-center">
              <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-secondary-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-secondary-900">
                  •••• •••• •••• 4242
                </p>
                <p className="text-xs text-secondary-500">Expires 12/25</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
              Default
            </span>
          </div>
        </div>
        
        <Button className="mt-4" variant="outline">
          <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'subscription':
        return <SubscriptionTab />;
      case 'usage':
        return <UsageTab />;
      case 'invoices':
        return <InvoicesTab />;
      case 'payment':
        return <PaymentTab />;
      default:
        return <SubscriptionTab />;
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Billing</h1>
          <p className="text-secondary-600">
            Manage your subscription and billing information
          </p>
        </div>

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
      </div>
    </Elements>
  );
};

export default Billing;