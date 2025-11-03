import React, { useState } from 'react';
import { ChevronDown, DollarSign, TrendingUp, Users } from 'lucide-react';
import withAdminLayout from '../AdminPanel/withAdminLayout';
import CurrentMonthActivity from '../../Components/Dashboard/CurrentMonthActivity';
import MonthlyGrowthChart from '../../Components/Dashboard/MonthlyGrowthChart';
import ProfitAfterTax from '../../Components/Dashboard/ProfitAfterTax';
import TopPerformers from '../../Components/Dashboard/TopPerformers';
import SubscriptionsPurchased from '../../Components/Dashboard/SubscriptionsPurchased';
import HeatMapCities from '../../Components/Dashboard/HeatMapCities';
import SupportTickets from '../../Components/Dashboard/SupportTickets';
import SubscriptionRenewalAlert from '../../Components/Dashboard/SubscriptionRenewalAlert';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const metrics = [
    {
      title: 'Total Revenue',
      value: '1 9008 xof',
      icon: DollarSign,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500'
    },
    {
      title: 'Monthly Recurring Revenue',
      value: '900 xof',
      icon: TrendingUp,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-500'
    },
    {
      title: 'Total POS Clients',
      value: '344',
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 w-full">
      {/* Topbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Dropdown */}
        <div className="relative z-20">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 w-[129px] h-[35px] px-4 py-2 bg-white border border-black rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700 text-sm font-medium">{selectedPeriod}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[246px] bg-white shadow rounded-lg flex flex-col px-3 py-5 gap-2">
              {[
                'Today', 'Yesterday', 'This Week', 'Three Month', 'Six Month', 'This Month'
              ].map(period => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setDropdownOpen(false);
                  }}
                  className={`
                    w-full text-left px-2 py-2 rounded 
                    text-sm font-medium font-[Manrope] 
                    ${selectedPeriod === period 
                      ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white' 
                      : 'hover:bg-gray-100 text-black'}
                  `}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow transition-shadow w-full flex items-center"
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-gray-600 font-medium text-base">{metric.title}</h3>
                  <p className="text-gray-900 font-bold text-xl">{metric.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 1 */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="w-full lg:w-3/5">
          <CurrentMonthActivity />
        </div>
        <div className="w-full lg:w-2/5">
          <MonthlyGrowthChart />
        </div>
      </div>

      {/* Section 2 */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="w-full lg:w-2/5">
          <ProfitAfterTax />
        </div>
        <div className="w-full lg:w-3/5">
          <TopPerformers />
        </div>
      </div>

      {/* Section 3 */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="w-full lg:w-3/5">
          <SubscriptionsPurchased />
        </div>
        <div className="w-full lg:w-2/5">
          <HeatMapCities />
        </div>
      </div>

      {/* Section 4 */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="w-full lg:w-2/5">
          <SupportTickets />
        </div>
        <div className="w-full lg:w-3/5">
          <SubscriptionRenewalAlert />
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(Dashboard);
