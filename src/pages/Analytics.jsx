import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import ReactECharts from 'echarts-for-react';
import { 
  FiTrendingUp, 
  FiFileText, 
  FiEye, 
  FiTarget,
  FiCalendar 
} from 'react-icons/fi';
import { campaignService } from '../services/campaignService';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const { data: analytics, isLoading } = useQuery(
    ['analytics', dateRange, selectedCampaign],
    () => campaignService.getCampaignAnalytics(selectedCampaign, { range: dateRange })
  );

  const { data: campaigns } = useQuery(
    'campaigns',
    () => campaignService.getCampaigns()
  );

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const contentGenerationChart = {
    title: {
      text: 'Content Generation Over Time',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: analytics?.contentGeneration?.dates || []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: analytics?.contentGeneration?.values || [],
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(14, 165, 233, 0.3)'
          }, {
            offset: 1, color: 'rgba(14, 165, 233, 0.1)'
          }]
        }
      },
      lineStyle: {
        color: '#0ea5e9'
      },
      itemStyle: {
        color: '#0ea5e9'
      }
    }]
  };

  const campaignPerformanceChart = {
    title: {
      text: 'Campaign Performance',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: analytics?.campaignPerformance || [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  const keywordRankingChart = {
    title: {
      text: 'Keyword Rankings',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: analytics?.keywordRankings?.keywords || []
    },
    yAxis: {
      type: 'value',
      inverse: true,
      min: 1,
      max: 100
    },
    series: [{
      data: analytics?.keywordRankings?.positions || [],
      type: 'bar',
      itemStyle: {
        color: '#22c55e'
      }
    }]
  };

  const statCards = [
    {
      title: 'Total Articles',
      value: analytics?.totalArticles || 0,
      change: '+12%',
      changeType: 'positive',
      icon: FiFileText,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Page Views',
      value: analytics?.pageViews || 0,
      change: '+8%',
      changeType: 'positive',
      icon: FiEye,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      title: 'Avg. Ranking',
      value: analytics?.avgRanking || 0,
      change: '-5%',
      changeType: 'positive',
      icon: FiTrendingUp,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      title: 'Active Campaigns',
      value: analytics?.activeCampaigns || 0,
      change: '+2',
      changeType: 'positive',
      icon: FiTarget,
      color: 'text-error-600',
      bgColor: 'bg-error-50'
    }
  ];

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
          <h1 className="text-2xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-600">
            Track your content performance and campaign metrics
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Campaigns</option>
            {campaigns?.campaigns?.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-secondary-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-secondary-900">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <ReactECharts
            option={contentGenerationChart}
            style={{ height: '300px' }}
          />
        </Card>

        <Card className="p-6">
          <ReactECharts
            option={campaignPerformanceChart}
            style={{ height: '300px' }}
          />
        </Card>
      </div>

      <Card className="p-6">
        <ReactECharts
          option={keywordRankingChart}
          style={{ height: '400px' }}
        />
      </Card>

      {/* Recent Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Recent Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-2 text-sm font-medium text-secondary-600">Article</th>
                <th className="text-left py-2 text-sm font-medium text-secondary-600">Campaign</th>
                <th className="text-left py-2 text-sm font-medium text-secondary-600">Published</th>
                <th className="text-left py-2 text-sm font-medium text-secondary-600">Views</th>
                <th className="text-left py-2 text-sm font-medium text-secondary-600">Ranking</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.recentPerformance?.map((item, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-3 text-sm text-secondary-900">{item.title}</td>
                  <td className="py-3 text-sm text-secondary-600">{item.campaign}</td>
                  <td className="py-3 text-sm text-secondary-600">
                    <div className="flex items-center">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                      {item.publishedDate}
                    </div>
                  </td>
                  <td className="py-3 text-sm text-secondary-600">{item.views}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.ranking <= 10 
                        ? 'bg-success-100 text-success-800'
                        : item.ranking <= 30
                        ? 'bg-warning-100 text-warning-800'
                        : 'bg-error-100 text-error-800'
                    }`}>
                      #{item.ranking}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;