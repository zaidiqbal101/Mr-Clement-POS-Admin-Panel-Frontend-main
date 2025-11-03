import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { name: 'Sat', newClients: 450, renewals: 240 },
  { name: 'Sun', newClients: 500, renewals: 130 },
  { name: 'Mon', newClients: 320, renewals: 260 },
  { name: 'Tue', newClients: 420, renewals: 370 },
  { name: 'Wed', newClients: 150, renewals: 230 },
  { name: 'Thu', newClients: 380, renewals: 220 },
  { name: 'Fri', newClients: 390, renewals: 340 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-2 rounded shadow-md">
        <p>{payload[0].payload.name}</p>
        <p>{`New Clients: ${payload[0].payload.newClients}`}</p>
        <p>{`Client Renewals: ${payload[0].payload.renewals}`}</p>
      </div>
    );
  }

  return null;
};

const CurrentMonthActivity = () => {
  return (
    <div className="w-full max-w-4xl  p-6 b ">
         <h2 className="poppins-text  text-2xl font-bold text-black mb-4 " >
            Current Month Activity
          </h2>

      <div
        className="bg-white rounded-3xl shadow-lg p-6"
        style={{
          boxShadow:
            '10px 10px 80px -15px rgba(231, 228, 232, 0.6), inset 0px 0px 1px rgba(0, 0, 0, 0.25)',
          filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
         
          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)' }}
              ></div>
              <span className="text-sm font-medium text-black" style={{ fontFamily: 'Poppins' }}>
                New Clients
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(106, 27, 154, 0.4) 0%, rgba(211, 47, 47, 0.4) 100%)',
                }}
              ></div>
              <span className="text-sm font-medium text-black" style={{ fontFamily: 'Poppins' }}>
                Client Renewals
              </span>
            </div>
          </div>
        </div>

        {/* Y-axis Label */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-black" style={{ fontFamily: 'Poppins' }}>
            Orders
          </span>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap={20}>
              <defs>
                <linearGradient id="newClients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6A1B9A" />
                  <stop offset="100%" stopColor="#D32F2F" />
                </linearGradient>
                <linearGradient id="renewals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(106, 27, 154, 0.4)" />
                  <stop offset="100%" stopColor="rgba(211, 47, 47, 0.4)" />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#F3F3F5" vertical={false} />
              <XAxis dataKey="name" stroke="#000" tick={{ fontSize: 14, fontFamily: 'Poppins' }} />
              <YAxis
                stroke="#000"
                tick={{ fontSize: 14, fontFamily: 'Poppins' }}
                interval={0}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="newClients" fill="url(#newClients)" radius={[10, 10, 0, 0]} barSize={15} />
              <Bar dataKey="renewals" fill="url(#renewals)" radius={[10, 10, 0, 0]} barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>

     

        {/* Additional Insights */}
       
      </div>
    </div>
  );
};

export default CurrentMonthActivity;
