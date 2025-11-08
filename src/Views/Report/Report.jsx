import React, { useState, useEffect } from 'react';
import { Loader2, Calendar, TrendingUp, TrendingDown, Users, UserX, RefreshCw } from 'lucide-react';
import withAdminLayout from '../AdminPanel/withAdminLayout';
import { getAuthToken } from '../../utils/auth';

const API_BASE_URL = 'https://vercel-mr-clement-pos-backend.vercel.app/api/restaurant/reports';

const Report = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const periods = [
    { id: 'today', label: 'Today', endpoint: 'reports_today' },
    { id: 'month', label: 'This Month', endpoint: 'reports_month' },
    { id: '6months', label: 'Last 6 Months', endpoint: 'reports_six_month' },
    { id: 'year', label: 'This Year', endpoint: 'reports_six_month' },
  ];

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    let token = getAuthToken();
    
    if (!token) {
      console.warn('No token found in storage. Using temporary hardcoded token.');
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjAyNTRmM2E5YmVhZTU5MjAyZWFkMSIsInVzZXJfaWQiOjEsImVtYWlsIjoicGF5YWthbnB1ckBnbWFpbC5jb20iLCJyb2xlIjoxLCJpYXQiOjE3NjI2MTcyNDcsImV4cCI6MTc2MjcwMzY0N30.ykLv0Yv2UiD57wna3fA46IS8qfCvD-Hwm3Andn9u_hU';
    }

    const currentPeriod = periods.find(p => p.id === selectedPeriod);
    
    try {
      setLoading(true);
      setError('');

      console.log(`Fetching reports for: ${currentPeriod.label}`);

      const response = await fetch(
        `${API_BASE_URL}/${currentPeriod.endpoint}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
          setLoading(false);
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      setReportData(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to load reports. Please try again.');
      // Set mock data for demonstration
      setReportData({
        active_clients: 19008,
        inactive_clients: 900,
        renewal_rate: 39,
        total_revenue: 250000,
        new_subscriptions: 150,
        cancelled_subscriptions: 45,
        active_subscriptions: 890,
        trial_accounts: 120,
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, bgColor, valueColor, trend, subtext }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className={`text-3xl font-bold ${valueColor || 'text-gray-900'} mb-1`}>
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-gray-500">{subtext}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center`}>
          <Icon className="h-7 w-7 text-gray-700" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 w-full bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Track your business performance</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReports}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedPeriod === period.id
                  ? 'bg-gradient-to-b from-purple-700 to-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-purple-600" />
            <p className="text-gray-600 text-lg">Loading reports...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <p className="text-yellow-800 mb-2">⚠️ {error}</p>
          <p className="text-sm text-yellow-700">Showing sample data for demonstration.</p>
        </div>
      )}

      {/* Report Content */}
      {!loading && reportData && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Active Clients"
                value={reportData.active_clients?.toLocaleString() || '0'}
                icon={Users}
                bgColor="bg-green-100"
                valueColor="text-green-600"
                trend={reportData.active_clients_trend}
              />
              <StatCard
                title="Inactive Clients"
                value={reportData.inactive_clients?.toLocaleString() || '0'}
                icon={UserX}
                bgColor="bg-red-100"
                valueColor="text-red-600"
                trend={reportData.inactive_clients_trend}
              />
              <StatCard
                title="Renewal Rate"
                value={`${reportData.renewal_rate || 0}%`}
                icon={TrendingUp}
                bgColor="bg-blue-100"
                valueColor="text-blue-600"
              />
              <StatCard
                title="Total Revenue"
                value={`$${(reportData.total_revenue || 0).toLocaleString()}`}
                icon={() => (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                bgColor="bg-yellow-100"
                valueColor="text-yellow-700"
                trend={reportData.revenue_trend}
              />
            </div>
          </div>

          {/* Subscription Metrics */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Active Subscriptions"
                value={reportData.active_subscriptions?.toLocaleString() || '0'}
                icon={() => (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                bgColor="bg-purple-100"
                valueColor="text-purple-600"
              />
              <StatCard
                title="New Subscriptions"
                value={reportData.new_subscriptions?.toLocaleString() || '0'}
                icon={() => (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                bgColor="bg-green-100"
                valueColor="text-green-600"
                subtext={`+${reportData.new_subscriptions_percent || 0}% from last period`}
              />
              <StatCard
                title="Cancelled Subscriptions"
                value={reportData.cancelled_subscriptions?.toLocaleString() || '0'}
                icon={() => (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                bgColor="bg-red-100"
                valueColor="text-red-600"
                subtext={`${reportData.cancelled_subscriptions_percent || 0}% churn rate`}
              />
              <StatCard
                title="Trial Accounts"
                value={reportData.trial_accounts?.toLocaleString() || '0'}
                icon={() => (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                bgColor="bg-orange-100"
                valueColor="text-orange-600"
              />
            </div>
          </div>

          {/* Additional Metrics */}
          {(reportData.support_tickets || reportData.average_response_time || reportData.customer_satisfaction) && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Support & Satisfaction</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportData.support_tickets && (
                  <StatCard
                    title="Support Tickets"
                    value={reportData.support_tickets.toLocaleString()}
                    icon={() => (
                      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                    bgColor="bg-indigo-100"
                    valueColor="text-indigo-600"
                    subtext={`${reportData.open_tickets || 0} open`}
                  />
                )}
                {reportData.average_response_time && (
                  <StatCard
                    title="Avg Response Time"
                    value={reportData.average_response_time}
                    icon={() => (
                      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    bgColor="bg-cyan-100"
                    valueColor="text-cyan-600"
                  />
                )}
                {reportData.customer_satisfaction && (
                  <StatCard
                    title="Customer Satisfaction"
                    value={`${reportData.customer_satisfaction}%`}
                    icon={() => (
                      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    bgColor="bg-pink-100"
                    valueColor="text-pink-600"
                  />
                )}
              </div>
            </div>
          )}


        </div>
      )}
    </div>
  );
};

export default withAdminLayout(Report);